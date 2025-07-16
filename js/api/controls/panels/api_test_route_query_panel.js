/**
 * @module APITestRouteQueryPanel
 * A panel for displaying a list of API Keys.
 * 
 * @version 1.0.0
 * Copyright (c) 2025 Koi
 */

import { KoiPanel } from "../../../../libs/web-components-lib/controls/panels/control_panel.js";
import { KoiSocketTemplateCapable, KoiCompositeSocket } from "../../../../libs/web-components-lib/socket.js";
import { KoiSocketConnectable } from "../../../../libs/web-components-lib/controls/control.js";
import { BloggerUserConnector } from "../../../blogger/providers/blogger_user_api_provider.js";
import { KoiControlBloggerUserDataConnectorInteractable } from "../../../blogger/blogger_user_data.js";

import { APIV1QueryProvider } from "../../providers/api_v1_query_provider.js";
if (customElements.get(APIV1QueryProvider.getTagName()) === undefined) {
	customElements.define(APIV1QueryProvider.getTagName(), APIV1QueryProvider);
}

import { ApiV1QueryForm } from "../forms/api_v1_query_form.js";
if (customElements.get(ApiV1QueryForm.getTagName()) === undefined) {
	customElements.define(ApiV1QueryForm.getTagName(), ApiV1QueryForm);
}

class APITestRouteQueryPanelSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds() {
		return {
			panel_header: this._holder.id + "_panel_header",
			provider: this._holder.id + "_provider",
			form: this._holder.id + "_form"
		};
	}

	constructor({ holder, user_connector }) {
		super({ holder });
		this._user_connector_id = user_connector;
	}

	_getLocalizedText(lang, key) {
		const dictionary = {
			header: {
				english: 'POST api/v1/query',
				russian: 'POST api/v1/query'
			}
		};
		return (dictionary[key] && dictionary[key][lang]) ? dictionary[key][lang] : dictionary[key]['en'];
	}

	getTemplate() {
		return '<div class="card-header" id="' + this.getID('panel_header') + '">' +
		'</div>' +
		'<div class="card-body">' +
			APIV1QueryProvider.getTag({
				element_id: this.getID('provider'),
				save_url: 'api/v1/query'
			}) +
			ApiV1QueryForm.getTag({
				element_id: this.getID('form'),
				provider_id: this.getID('provider')
			}) +
		'</div>';
	}

	updateTexts(){
		//
	}

	displayError(){
		//
	}

	changeLanguage(language){
		this._items.panel_header.innerHTML = this._getLocalizedText(language, 'header');
	}

}

export class APITestRouteQueryPanel extends KoiSocketConnectable(
	KoiControlBloggerUserDataConnectorInteractable(
		KoiPanel
	)
) {

	static getTagName() {
		return 'api-test-route-query-panel';
	}

	static getTag({ element_id, user_connector, element_class, debug_mode }) {
		let tag_name = this.getTagName();
		let str_id = element_id ? ` id="${element_id}"` : '';
		let str_user_connector = user_connector ? ` provider_id="${user_connector}"` : '';
		let str_class = element_class ? ` class="${element_class}"` : ' class="blogger-payments-list-panel"';
		let str_debug_mode = debug_mode ? ' debug_mode="true"' : '';
		return `<${tag_name}${str_id}${str_user_connector}${str_class}${str_debug_mode}></${tag_name}>`;
	}

	_constructSocket() {
		return new APITestRouteQueryPanelSocket({
			holder: this,
			user_connector: this._connector.getID()
		});
	}

	_changeSocketLanguage(){
		if(!this._isLanguageChanged()){
			return;
		}
		this.socket.changeLanguage(this._getLanguage());
	}

	_updateSocket(){
		super._updateSocket();
		this._changeSocketLanguage();
		this.socket.updateTexts();
	}

	_displayForbidden() {
		super._displayForbidden();
		this._changeSocketLanguage();
		this.socket.displayError();
	}

	_displayError() {
		super._displayError();
		this._changeSocketLanguage();
		this.socket.displayError();
	}

	_updateStateCodeWhenConnectorDataChanged(event_detail){
		super._updateStateCodeWhenConnectorDataChanged(event_detail);
		this._state.setChanged();
	}

}
