/**
 * @module APITestRoutePanel
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

import { APIV1AudienceProcessIdProvider } from "../../providers/api_v1_audience_process_id_provider.js";
if (customElements.get(APIV1AudienceProcessIdProvider.getTagName()) === undefined) {
	customElements.define(APIV1AudienceProcessIdProvider.getTagName(), APIV1AudienceProcessIdProvider);
}

import { ApiV1AudienceProcessIdForm } from "../forms/api_v1_audience_process_id_form.js";
if (customElements.get(ApiV1AudienceProcessIdForm.getTagName()) === undefined) {
	customElements.define(ApiV1AudienceProcessIdForm.getTagName(), ApiV1AudienceProcessIdForm);
}

class APITestRoutePanelSocket extends KoiSocketTemplateCapable(
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
				english: 'GET api/v1/audience/{process_id}',
				russian: 'GET api/v1/audience/{process_id}'
			}
		};
		return (dictionary[key] && dictionary[key][lang]) ? dictionary[key][lang] : dictionary[key]['en'];
	}

	getTemplate() {
		return '<div class="card-header" id="' + this.getID('panel_header') + '">' +
		'</div>' +
		'<div class="card-body">' +
			APIV1AudienceProcessIdProvider.getTag({
				element_id: this.getID('provider'),
				load_url: 'api/v1/audience/'
			}) +
			ApiV1AudienceProcessIdForm.getTag({
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

export class APITestRoutePanel extends KoiSocketConnectable(
	KoiControlBloggerUserDataConnectorInteractable(
		KoiPanel
	)
) {

	static getTagName() {
		return 'api-test-route-panel';
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
		return new APITestRoutePanelSocket({
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
