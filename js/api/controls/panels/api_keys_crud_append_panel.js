/**
 * @module APIKeysCRUDAppendPanel
 * A simple panel that displays user information or a "not logged in" message.
 * 
 * @version 1.0.0
 * Copyright (c) 2025 Koi
 */

import { KoiIdLink } from "../../../../libs/web-components-lib/controls/buttons/control_idbutton.js";
import { KoiSocketConnectable, KoiBaseControl } from "../../../../libs/web-components-lib/controls/control.js";
import { KoiCompositeSocket, KoiSocketTemplateCapable } from "../../../../libs/web-components-lib/socket.js";
import { KoiControlBloggerUserDataConnectorInteractable } from "../../../blogger/blogger_user_data.js";
import { KoiOperationsInterceptable } from "../../../../libs/web-components-lib/event_operated.js";
import { BloggerIdButton } from "../../../blogger/controls/buttons/blogger_idbutton.js";
if (customElements.get(BloggerIdButton.getTagName()) === undefined) {
	customElements.define(BloggerIdButton.getTagName(), BloggerIdButton);
}

import { APIKeysCRUDAppendItemProvider } from "../../providers/api_keys_crud_append_item_provider.js";
if (customElements.get(APIKeysCRUDAppendItemProvider.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDAppendItemProvider.getTagName(), APIKeysCRUDAppendItemProvider);
}
import { APIKeysCRUDAppendNewItemPanel } from "../../../api/controls/panels/api_keys_crud_append_newitem_panel.js";
if (customElements.get(APIKeysCRUDAppendNewItemPanel.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDAppendNewItemPanel.getTagName(), APIKeysCRUDAppendNewItemPanel);
}

class APIKeysCRUDAppendPanelSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds(){
		return {
			appendFormContainer: this._holder.id + "_appendFormContainer",
			messageContainer: this._holder.id + "_messageContainer",
			messageContainerText: this._holder.id + "_messageContainerText",
			errorMessageContainer: this._holder.id + "_errorMessageContainer",
			startButtonContainer: this._holder.id + "_startButtonContainer",
			startButton: this._holder.id + '_startButton',
			closeKeyCreatedBtn: this._holder.id + '_closeKeyCreatedBtn',
			append_provider: this._holder.id + "_append_provider"
		};
	}

	getTemplate(){
		return '' +
			'<div id="' + this.getID('appendFormContainer') + '" class="d-none">' +
				APIKeysCRUDAppendNewItemPanel.getTag({
					element_id: this._holder.id + '_add_panel', 
					provider_id: this.getID('append_provider'),
					element_class: 'crud-sample-append-panel'
				}) +
				APIKeysCRUDAppendItemProvider.getTag({
					element_id: this.getID('append_provider'),
					load_url: 'apikeys/apikey',
					save_url: 'apikeys/apikey',
					user_connector: this._holder._connector._id
				}) +
			'</div>' +
			'<div id="' + this.getID('errorMessageContainer') + '" class="card mb-3 d-none" style="padding: 14px;">' +
			'</div>' +
			'<div id="' + this.getID('startButtonContainer') + '" class="" style="padding: 14px;">' +
				BloggerIdButton.getTag({
					element_id: this.getID('startButton'),
					btn_enabled: true,
					item_action: 'show_append_form'
				}) +
			'</div>' +
			'<div id="' + this.getID('messageContainer') + '" class="d-none" style="">' +
				'<div id="' + this.getID('messageContainerText') + '" class="api-keys-crud-append-panel-result" style="">' +
				'</div>' +
				this._getCloseButtonTemplate() +
			'</div>' +
		'';
	}

	_getCloseButtonTemplate(){
		return BloggerIdButton.getTag({
			element_id: this.getID('closeKeyCreatedBtn'),
			btn_enabled: true,
			placeholder: 'Close',
			item_action: 'close_append_panel'
		});
	}

	_getNewKeyPanel({apikey}){
		return '<div class="card copy-key-card">' + 
			'<div id="copy-key-card-contents">' + apikey + '</div>' +
			KoiIdLink.getTag({
				element_id: this._holder.id + '_copy_btn',
				item_id: '',
				item_action: 'copy_to_clipboard',
				placeholder: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">' +
					'<path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>' +
				'</svg>'
			}) +
			'<div id="copy-key-card-contents-msg" class="d-none"></div>' +
		'</div>';
	}

	_getEnglishKeyAppended(item_properties) {
		if(!item_properties) return;
		return '<h3>API Key Created</h3>' +
			'<p>Here is your new API key. Please copy and save it securely — you won\'t be able to view it again.</p>' +
			this._getNewKeyPanel(item_properties) +
			'<p>Do not share this key or expose it in client-side code.</p>';
	}

	_getRussianKeyAppended(item_properties) {
		if(!item_properties) return;
		return '<h3>Ключ создан</h3>' +
			'<p>Вот ваш новый API-ключ. Скопируйте и сохраните его в безопасном месте — вы не сможете увидеть его снова.</p>' +
			this._getNewKeyPanel(item_properties) +
			'<p>Не делитесь этим ключом и не размещайте его в браузере или клиентском коде. Если ключ будет скомпрометирован, удалите его и создайте новый.</p>';
	}

	_getLocalizedText(lang, key, item_properties = null) {
		const dictionary = {
			not_logged_in: {
				english: 'You are not logged in',
				russian: 'Вы не вошли в систему'
			},
			start_button_text: {
				english: 'Create API key',
				russian: 'Создать ключ API'
			},
			close_key_created_button_text: {
				english: 'Close',
				russian: 'Закрыть'
			},
			key_copied: {
				english: 'API key copied',
				russian: 'Ключ скопирован'
			},
			key_appended: {
				english: this._getEnglishKeyAppended(item_properties),
				russian: this._getRussianKeyAppended(item_properties)
			}
		};
		return (dictionary[key] && dictionary[key][lang]) ? dictionary[key][lang] : dictionary[key]['en'];
	}

	displayStartButton() {
		this._hide('appendFormContainer');
		this._hide('errorMessageContainer');
		this._hide('messageContainer');
		this._show('startButtonContainer');
	}

	displayErrorMessage() {
		this._hide('appendFormContainer');
		this._hide('messageContainer');
		this._show('errorMessageContainer');
		this._hide('startButtonContainer');
	}

	displayAppendForm() {
		this._show('appendFormContainer');
		this._hide('messageContainer');
		this._hide('errorMessageContainer');
		this._hide('startButtonContainer');
	}

	displayMessage(language, item_properties) {
		this._hide('appendFormContainer');
		this._show('messageContainer');
		this._hide('errorMessageContainer');
		this._hide('startButtonContainer');
		const message = this._getLocalizedText(language, 'key_appended', item_properties);
		this._items.messageContainerText.innerHTML = message;
	}

	displayKeyCopied(language){
		const key_copied_div = document.getElementById('copy-key-card-contents-msg');
		if(!key_copied_div){
			return;
		}
		key_copied_div.innerHTML = this._getLocalizedText(language, 'key_copied');
		key_copied_div.classList.remove('d-none');
	}

	changeLanguage(language){
		this._items.errorMessageContainer.textContent = this._getLocalizedText(language, 'not_logged_in');
		this._items.startButton.changeText(this._getLocalizedText(language, 'start_button_text'));
		this._items.closeKeyCreatedBtn.changeText(this._getLocalizedText(language, 'close_key_created_button_text'));
	}

	attemptAppendItem(item_name){
		this._items['append_provider'].attemptSaveAPI({
			name: item_name
		});
	}

}

export class APIKeysCRUDAppendPanel extends KoiOperationsInterceptable(
	KoiControlBloggerUserDataConnectorInteractable(
		KoiSocketConnectable(
			KoiBaseControl
		)
	)
) {

	static getTagName(){
		return 'api-keys-crud-append-panel';
	}

	static getTag({element_id, user_connector, element_class, debug_mode}){
		let tag_name = this.getTagName();
		let str_id = element_id ? ` id="${element_id}"` : '';
		let str_provider = user_connector ? ` provider_id="${user_connector}"` : '';
		let str_class = element_class ? ` class="${element_class}"` : ' class="card"';
		let str_debug_mode = debug_mode ? ' debug_mode="true"' : '';
		return `<${tag_name}${str_id}${str_provider}${str_class}${str_debug_mode}></${tag_name}>`;
	}

	_constructSocket(){
		return new APIKeysCRUDAppendPanelSocket({
			holder: this
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
		this.socket.displayStartButton();
	}

	_displayForbidden() {
		super._displayForbidden();
		this._changeSocketLanguage();
		this.socket.displayErrorMessage();
	}

	_displayError() {
		super._displayError();
		this._changeSocketLanguage();
		this.socket.displayErrorMessage();
	}

	displayKeyAppendedMessage(item_properties){
		this._changeSocketLanguage();
		this.socket.displayMessage(this._getLanguage(), item_properties);
		// TODO - удаление ключа из коннектора
	}

	_updateStateCodeWhenConnectorDataChanged(event_detail){
		super._updateStateCodeWhenConnectorDataChanged(event_detail);
		this._state.setChanged();
	}

	_copyToClipboard(text, holder) {
		navigator.clipboard.writeText(text)
		.then(() => {
			holder.socket.displayKeyCopied(
				holder._getLanguage()
			);
		})
		.catch(err => {
			console.error('Ошибка копирования:', err);
		});
	}

	_handleOperated(event_detail) {
		super._handleOperated(event_detail);
		if (event_detail.element_id === this.socket.getID('startButton')) {
			this.socket.displayAppendForm();
		}else if (event_detail.element_id === this.socket.getID('closeKeyCreatedBtn')) {
			this.socket.displayStartButton();
		}else if(event_detail.data.getAction() == 'copy_to_clipboard'){
			this._copyToClipboard(
				document.getElementById('copy-key-card-contents').innerHTML,
				this
			);
		}
	}

	_stopPropagationWhenOperated(event){
		// Do not stop propagation
	}

	attemptAppendItem(item_name){
		this.socket.attemptAppendItem(item_name);
	}

}
