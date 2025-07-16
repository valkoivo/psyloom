/**
 * @module ApiKeysCRUDPanel
 * 
 * A basic component for the CRUD panel. This component is designed 
 * to demonstrate an approach to constructing CRUD panels. 
 * It combines a provider that delivers a list of records and 
 * simulates server interaction with a panel for displaying those records.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { KoiPanel } from "../../../../libs/web-components-lib/controls/panels/control_panel.js";
import { KoiSocketConnectable } from "../../../../libs/web-components-lib/controls/control.js";
import { KoiSocketTemplateCapable, KoiCompositeSocket } from "../../../../libs/web-components-lib/socket.js";
import { BloggerUserConnector } from "./../../../blogger/providers/blogger_user_api_provider.js";
import { KoiControlBloggerUserDataConnectorInteractable } from "../../../blogger/blogger_user_data.js";

import { BloggerBillingListAPIProvider } from "../../../blogger/providers/blogger_billing_list_api_provider.js";
if (customElements.get(BloggerBillingListAPIProvider.getTagName()) === undefined) {
	customElements.define(BloggerBillingListAPIProvider.getTagName(), BloggerBillingListAPIProvider);
}
import { ApiKeysCRUDHeaderedFrame } from "../../../api/controls/panels/api_keys_crud_headered_frame.js";
if (customElements.get(ApiKeysCRUDHeaderedFrame.getTagName()) === undefined) {
	customElements.define(ApiKeysCRUDHeaderedFrame.getTagName(), ApiKeysCRUDHeaderedFrame);
}

class ApiKeysCRUDPanelSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	// TODO - Перенести тексты с карточкой в BloggerAPIKeysPanelSocket

	_getEmptySchemaIds(){
		return {
			apikeys_provider: this._holder.id + "_apikeys_provider",
			apikeys_holder: this._holder.id + "_apikeys_holder",
			error_holder: this._holder.id + "_error_holder",
			description_header: this._holder.id + "_description_header",
			description_holder: this._holder.id + "_description_holder"
		};
	}

	getTemplate(){
		return '<div id="' + this.getID('apikeys_holder') + '">' +
			'<div class="card mb-3">' +
				'<div id="' + this.getID('description_header') + '" class="card-header"></div>' +
				'<div id="' + this.getID('description_holder') + '" class="card-body"></div>' +
			'</div>' +
			BloggerBillingListAPIProvider.getTag({
				element_id: this.getID('apikeys_provider'),
				load_url: 'apikeys/apikey',
				user_connector: this._user_connector
			}) +
			ApiKeysCRUDHeaderedFrame.getTag({
				element_id: this._holder.id + '_table', 
				provider_id: this.getID('apikeys_provider'),
				element_class: 'mb-0',
				user_connector: this._user_connector
			}) +
		'</div>' +
		'<div id="' + this.getID('error_holder') + '">' +
		'</div>';
	}

	constructor({ holder, user_connector }) {
		super({ holder });
		this._user_connector = user_connector;
	}

	_getEnglishDescription(){
		// TODO - Создать Usage page и дать здесь ссылку
		return '<p>You can view and manage all API keys here.</p>' +
			'<p>Do not share your API key with others or expose it in the browser or other client-side code. To protect your account\'s security, we may automatically disable any API key that has leaked publicly.</p>' +
			'<p>View usage per API key on the Usage page.</p>';
	}

	_getRussianDescription(){
		// TODO - Создать Usage page и дать здесь ссылку
		return '<p>Здесь вы можете просматривать и управлять всеми API-ключами.</p>' +
		   '<p>Не делитесь своими API-ключами с другими людьми и не размещайте их в браузере или в клиентском коде. В целях безопасности вашей учётной записи мы можем автоматически отключить любой API-ключ, который стал общедоступным.</p>' +
		   '<p>Просматривайте использование каждого API-ключа на странице "Использование".</p>';
	}

	_getLocalizedText(lang, key) {
		const dictionary = {
			not_logged_in: {
				english: 'You are not logged in',
				russian: 'Вы не вошли в систему'
			},
			description_header: {
				english: 'API Keys',
				russian: 'Ключи API'
			},
			description: {
				english: this._getEnglishDescription(),
				russian: this._getRussianDescription()
			}
		};
		return (dictionary[key] && dictionary[key][lang]) ? dictionary[key][lang] : dictionary[key]['en'];
	}

	showAPIKeys() {
		this._show('apikeys_holder');
		this._hide('error_holder');
	}

	showNotLoggedInMessage() {
		this._hide('apikeys_holder');
		this._show('error_holder');
	}

	changeLanguage(language){
		this._items.error_holder.textContent = this._getLocalizedText(language, 'not_logged_in');
		this._items.description_header.innerHTML = this._getLocalizedText(language, 'description_header');
		this._items.description_holder.innerHTML = this._getLocalizedText(language, 'description');
	}

}

export const ApiKeysCRUDPanelSocketConnectable = Sup => class extends KoiSocketConnectable(Sup) {

	_constructSocket(){
		return new ApiKeysCRUDPanelSocket({
			holder: this,
			user_connector: this._connector._id
		});
	}

	_changeSocketLanguage(){
		if(!this._isLanguageChanged()){
			return;
		}
		this.socket.changeLanguage(this._getLanguage());
	}

	_updateSocket() {
		super._updateSocket();
		this._changeSocketLanguage();
		this.socket.showAPIKeys();
	}

	_displayForbidden() {
		super._displayForbidden();
		this._changeSocketLanguage();
		this.socket.showNotLoggedInMessage();
	}

	_displayError() {
		super._displayError();
		this._changeSocketLanguage();
		this.socket.showNotLoggedInMessage();
	}

}

export class ApiKeysCRUDPanel extends ApiKeysCRUDPanelSocketConnectable(
	KoiControlBloggerUserDataConnectorInteractable(
		KoiPanel
	)
) {

	static getTagName(){
		return 'api-keys-crud-panel';
	}

	static getTag({element_id, user_connector, debug_mode}){
		let tag_name = this.getTagName();
		let str_user_connector = user_connector ? ` provider_id="${user_connector}"` : '';
		let str_debug_mode = debug_mode ? 'debug_mode="true"' : '';
		return '<' + tag_name + ' id="' + element_id + 
			'" ' + str_user_connector + 
			' ' + str_debug_mode + 
			'></' + tag_name + '>';
	}

	_updateStateCodeWhenConnectorDataChanged(event_detail){
		super._updateStateCodeWhenConnectorDataChanged(event_detail);
		this._state.setChanged();
	}

}
