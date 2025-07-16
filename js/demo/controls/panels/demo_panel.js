/**
 * @module DemoPanel
 * A simple panel for demo.
 * 
 * @version 1.0.0
 * Copyright (c) 2025 Koi
 */

import { KoiPanel } from "../../../../libs/web-components-lib/controls/panels/control_panel.js";
import { KoiSocketTemplateCapable, KoiSingleSocket } from "../../../../libs/web-components-lib/socket.js";
import { KoiSocketConnectable } from "../../../../libs/web-components-lib/controls/control.js";

import { DemoUserAPIProvider } from "./../../providers/demo_user_api_provider.js";
if (customElements.get(DemoUserAPIProvider.getTagName()) === undefined) {
	customElements.define(DemoUserAPIProvider.getTagName(), DemoUserAPIProvider);
}

import { DemoAuthPanel } from "./demo_auth_panel.js";
if (customElements.get(DemoAuthPanel.getTagName()) === undefined) {
	customElements.define(DemoAuthPanel.getTagName(), DemoAuthPanel);
}

import { DemoGamePanel } from "./demo_game_panel.js";
if (customElements.get(DemoGamePanel.getTagName()) === undefined) {
	customElements.define(DemoGamePanel.getTagName(), DemoGamePanel);
}

class DemoPanelSocket extends KoiSocketTemplateCapable(KoiSingleSocket) {

	getTemplate() {
		return DemoUserAPIProvider.getTag({
			element_id: this.getID(),
			load_url: 'https://api.psyloom.com/auth/login',
			save_url: 'https://api.psyloom.com/auth/login'
		}) +
		DemoAuthPanel.getTag({
			element_id: this._holder.id + '_auth_panel',
			element_class: 'demo-panel-login-panel',
			user_connector: this.getID()
		}) +
		DemoGamePanel.getTag({
			element_id: this._holder.id + '_game_panel',
			element_class: 'demo-panel-game-panel d-none',
			user_connector: this.getID()
		});
	}
}

export class DemoPanel extends KoiSocketConnectable(KoiPanel) {

	static getTagName() {
		return 'demo-panel';
	}

	static getTag({ element_id, element_class, debug_mode }) {
		let tag_name = this.getTagName();
		let str_id = element_id ? ` id="${element_id}"` : '';
		let str_class = element_class ? ` class="${element_class}"` : ' class="blogger-settings-panel"';
		let str_debug_mode = debug_mode ? ' debug_mode="true"' : '';
		return `<${tag_name}${str_id}${str_class}${str_debug_mode}></${tag_name}>`;
	}

	_constructSocket() {
		return new DemoPanelSocket({
			holder: this
		});
	}
}
