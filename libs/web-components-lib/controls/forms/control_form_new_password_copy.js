/**
 * @module KoiFormNewPassword
 * 
 * id - required
 * connector - user_model
*/

import { KoiCompositeSocket, KoiSocketTemplateCapable } from "../../../../libs/web-components-lib/socket.js";
import { KoiOperationsInterceptable } from "../../../../libs/web-components-lib/event_operated.js";
import { KoiControlConnectorInteractable, KoiSocketConnectable, KoiBaseControl } from "../../../../libs/web-components-lib/controls/control.js";

import { KoiFormFieldPassword } from "./control_form_field_password.js";
if (customElements.get('koi-form-field-password') === undefined) {
	customElements.define('koi-form-field-password', KoiFormFieldPassword);
}
import { KoiIdButton } from "../buttons/control_idbutton.js";
if (customElements.get(KoiIdButton.getTagName()) === undefined) {
	customElements.define(KoiIdButton.getTagName(), KoiIdButton);
}
import { KoiLabel } from "../labels/control_label.js";
if (customElements.get(KoiLabel.getTagName()) === undefined) {
	customElements.define(KoiLabel.getTagName(), KoiLabel);
}

export class KoiFormNewPasswordSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds(){
		return {
			formpanel: this._holder.id + '_formpanel',
			successpanel: this._holder.id + '_successpanel',
			passwordinput: this._holder.id + '_passwordinput',
			password_confirmationinput: this._holder.id + '_password_confirmationinput',
			btn: this._holder.id + '_btn',
			errorlabel: this._holder.id + '_errorlabel'
		};
	}

	_getFieldsetTemplate(){
		return KoiLabel.getTag({
			element_id: this.getID('errorlabel'),
			value: ''
		}) +
		KoiFormFieldPassword.getTag({
			element_id: this.getID('passwordinput'),
			field_name: 'password',
			placeholder: this._getPasswordPlaceholder(),
			element_class: 'mb-3 d-block'
		}) +
		KoiFormFieldPassword.getTag({
			element_id: this.getID('password_confirmationinput'),
			field_name: 'password_confirmation',
			placeholder: this._getPasswordConfirmationPlaceholder(),
			element_class: 'mb-3 d-block'
		}) +
		KoiIdButton.getTag({
			element_id: this.getID('btn'),
			item_action: 'Submit',
			btn_type: 'submit',
			placeholder: this._getSubmitButtonText(),
			btn_enabled: true
		});
	}

	getTemplate(){
		return '<div id="' + this.getID('formpanel') + '" class="modal-form-panel">' +
			'<form onsubmit="event.preventDefault();">' +
				'<fieldset>' +
					this._getFieldsetTemplate() +
				'</fieldset>' +
			'</form>' +
		'</div>' +
		'<div id="' + this.getID('successpanel') + '">' +
			this.getSuccessText() +
		'</div>';
	}

	_enable(key){
		if(this._items[key] && typeof this._items[key].enable === 'function'){
			this._items[key].enable();
		}else if(this._items[key]){
			this._items[key].removeAttribute('disabled');
		}
	}

	_disable(key){
		if(this._items[key] && typeof this._items[key].disable === 'function'){
			this._items[key].disable();
		}else if(this._items[key]){
			this._items[key].setAttribute('disabled', 'disabled');
		}
	}

	_showHourglass(){
		this._items['btn'].showHourglass();
	}

	_hideHourglass(){
		this._items['btn'].hideHourglass();
	}

	_setErrorLabel(message){
		this._items['errorlabel'].attemptChangeValue(message);
	}

	_clearErrorLabel(){
		this._items['errorlabel'].hide();
		this._items['passwordinput'].socket.removeError();
		this._items['password_confirmationinput'].socket.removeError();
	}

	_showErrors(event_error){
		this._items['errorlabel'].hide();
		if(event_error && event_error.hasOwnProperty('errors')){
			if('form' in event_error['errors']){
				this._items['errorlabel'].show();
				this._items['errorlabel'].attemptChangeValue(event_error['errors']['form'].join(' '));
			}else{
				this._items['errorlabel'].hide();
			}
			if('password' in event_error['errors']){
				this._items['passwordinput'].socket.displayError(event_error['errors']['password'].join(' '));
			}else{
				this._items['passwordinput'].socket.removeError();
			}
			if('password_confirmation' in event_error['errors']){
				this._items['password_confirmationinput'].socket.displayError(event_error['errors']['password_confirmation'].join(' '));
			}else{
				this._items['password_confirmationinput'].socket.removeError();
			}
		}else if(event_error && event_error.hasOwnProperty('message')){
			this._items['errorlabel'].show();
			this._items['errorlabel'].attemptChangeValue(event_error['message']);
			this._items['passwordinput'].socket.removeError();
			this._items['password_confirmationinput'].socket.removeError();
		}else if(event_error){
			this._items['errorlabel'].show();
			this._items['errorlabel'].attemptChangeValue(event_error);
			this._items['passwordinput'].socket.removeError();
			this._items['password_confirmationinput'].socket.removeError();
		}else{
			this._clearErrorLabel();
		}
	}

	activateForm(){
		this._show('formpanel');
		this._hide('successpanel');
		this._enable('passwordinput');
		this._enable('password_confirmationinput');
		this._enable('btn');
		this._hideHourglass();
		this._clearErrorLabel();
	}

	displayLoading(){
		this._show('formpanel');
		this._hide('successpanel');
		this._disable('passwordinput');
		this._disable('password_confirmationinput');
		this._disable('btn');
		this._showHourglass();
		this._clearErrorLabel();
	}

	displaySuccess(){
		this._hide('formpanel');
		this._show('successpanel');
		this._enable('passwordinput');
		this._enable('password_confirmationinput');
		this._enable('btn');
		this._hideHourglass();
		this._clearErrorLabel();
	}

	displayError(event_error){
		this._show('formpanel');
		this._hide('successpanel');
		this._enable('passwordinput');
		this._enable('password_confirmationinput');
		this._enable('btn');
		this._hideHourglass();
		this._showErrors(event_error);
	}

	attemptGetPassword(){
		return this._items['passwordinput'].data.getFieldValue();
	}

	attemptGetPasswordConfirmation(){
		return this._items['password_confirmationinput'].data.getFieldValue();
	}

	_getPasswordPlaceholder(){
		if(this._language == 'english'){
			return 'Password';
		}else if(this._language == 'russian'){
			return 'Пароль';
		}
	}

	_getPasswordConfirmationPlaceholder(){
		if(this._language == 'english'){
			return 'Password confirmation';
		}else if(this._language == 'russian'){
			return 'Подтверждение пароля';
		}
	}

	_getSubmitButtonText(){
		if(this._language == 'english'){
			return 'Submit';
		}else if(this._language == 'russian'){
			return 'Отправить';
		}
	}

	getSuccessText(){
		if(this._language == 'english'){
			return 'Password has been successfully reset';
		}else if(this._language == 'russian'){
			return 'Пароль успешно сброшен';
		}
	}

	getBadConnectionText(){
		if(this._language == 'english'){
			return 'Server connection problem';
		}else if(this._language == 'russian'){
			return 'Проблема соединения с сервером';
		}
	}

	getForbiddenText(){
		if(this._language == 'english'){
			return 'Not authorized to reset password';
		}else if(this._language == 'russian'){
			return 'Нет прав для сброса пароля';
		}
	}

	constructor(params){
		super(params);
		this._language = params.language;
	}
}

export class KoiFormNewPassword extends KoiOperationsInterceptable(
	KoiSocketConnectable(
		KoiControlConnectorInteractable(
			KoiBaseControl
		)
	)
) {

	static getTagName(){
		return 'koi-form-new-password';
	}

	static getTag({element_id, user_new_password_connector, email, token}){
		let tag_name = this.getTagName();
		return '<' + tag_name + 
			' id="' + element_id + 
			'" provider_id="' + user_new_password_connector + 
			'" email="' + email + 
			'" token="' + token + 
			'"></' + tag_name + '>';
	}

	_displayWaiting(){
		super._displayWaiting();
		this.socket.displayLoading();
	}

	_displayBadConnection(){
		super._displayBadConnection();
		this.socket.displayError(this.socket.getBadConnectionText());
	}

	_displayError(){
		super._displayError();
		this.socket.displayError(this._state.getError());
	}

	_displayForbidden(){
		super._displayForbidden();
		this.socket.displayError(this.socket.getForbiddenText());
	}

	_updateSocket(){
		super._updateSocket();
		this.socket.displaySuccess();
	}

	_constructSocket(){
		return new KoiFormNewPasswordSocket({
			holder: this,
			language: this._connector._item._connector._item.data.getLanguage()
		});
	}

	_updateStateCodeWhenConnectorDataChanged(event_detail){
		this._setStateCode(
			this._determineStateCode()
		);
		this._state.setError(event_detail.state.getError());
	}

	_updateNewPasswordProvider(event_detail){
		this._connector._item.attemptSaveAPI({
			email: this.getAttribute('email'),
			token: this.getAttribute('token'),
			password: this.socket.attemptGetPassword(),
			password_confirmation: this.socket.attemptGetPasswordConfirmation()
		});
	}

	_updateSomethingWhenOperated(event_detail){
		super._updateSomethingWhenOperated(event_detail);
		this._updateNewPasswordProvider(event_detail);
	}

	_getChangedEventCode() {
		return 'koi-user-new-password-changed';
	}

	attemptSaveAPI(data){
		this._item.attemptSaveAPI(data);
	}

}
