/**
 * @module KoiFormResetPassword
 * 
 * id - required
 * connector - user_model
*/

import { KoiCompositeSocket, KoiSocketTemplateCapable } from "../../../../libs/web-components-lib/socket.js";
import { KoiOperationsInterceptable } from "../../../../libs/web-components-lib/event_operated.js";
import { KoiControlConnectorInteractable, KoiSocketConnectable, KoiBaseControl } from "../../../../libs/web-components-lib/controls/control.js";

import { KoiFormFieldString } from "./control_form_field_string.js";
if (customElements.get('koi-form-field-string') === undefined) {
	customElements.define('koi-form-field-string', KoiFormFieldString);
}
import { KoiIdButton } from "../buttons/control_idbutton.js";
if (customElements.get(KoiIdButton.getTagName()) === undefined) {
	customElements.define(KoiIdButton.getTagName(), KoiIdButton);
}
import { KoiLabel } from "../labels/control_label.js";
if (customElements.get(KoiLabel.getTagName()) === undefined) {
	customElements.define(KoiLabel.getTagName(), KoiLabel);
}


export class KoiFormResetPasswordSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {
	_getEmptySchemaIds(){
		return {
			formpanel: this._holder.id + '_formpanel',
			successpanel: this._holder.id + '_successpanel',
			emailinput: this._holder.id + '_emailinput',
			btn: this._holder.id + '_btn',
			errorlabel: this._holder.id + '_errorlabel'
		};
	}

	_getFieldsetTemplate(){
		return KoiLabel.getTag({
			element_id: this.getID('errorlabel'),
			value: ''
		}) +
		KoiFormFieldString.getTag({
			element_id: this.getID('emailinput'),
			field_name: 'email',
			placeholder: 'Email',
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

	_getSubmitButtonText(){
		if(this._language == 'english'){
			return 'Send password reset link';
		}else if(this._language == 'russian'){
			return 'Отправить ссылку на восстановление';
		}
	}

	getTemplate(){
		return '<div id="' + this.getID('formpanel') + '">' +
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

	getSuccessText(){
		if(this._language == 'english'){
			return 'A password reset link has been sent to your email';
		}else if(this._language == 'russian'){
			return 'Инструкция по сбросу пароля отправлена';
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

	_enable(key){
		if (this._items[key] && typeof this._items[key].enable === 'function') {
			this._items[key].enable();
		} else if (this._items[key]) {
			this._items[key].removeAttribute('disabled');
		}
	}

	_disable(key){
		if (this._items[key] && typeof this._items[key].disable === 'function') {
			this._items[key].disable();
		} else if (this._items[key]) {
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
		this._items['emailinput'].socket.removeError();
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
			if('email' in event_error['errors']){
				this._items['emailinput'].socket.displayError(event_error['errors']['email'].join(' '));
			}else{
				this._items['emailinput'].socket.removeError();
			}
		}else if(event_error && event_error.hasOwnProperty('message')){
			this._items['errorlabel'].show();
			this._items['errorlabel'].attemptChangeValue(event_error['message']);
			this._items['emailinput'].socket.removeError();
		}else if(event_error){
			this._items['errorlabel'].show();
			this._items['errorlabel'].attemptChangeValue(event_error);
			this._items['emailinput'].socket.removeError();
		}else{
			this._clearErrorLabel();
		}
	}

	activateForm(){
		this._show('formpanel');
		this._hide('successpanel');
		this._enable('emailinput');
		this._enable('btn');
		this._hideHourglass();
		this._clearErrorLabel();
	}

	displayLoading(){
		this._show('formpanel');
		this._hide('successpanel');
		this._disable('emailinput');
		this._disable('btn');
		this._showHourglass();
		this._clearErrorLabel();
	}

	displaySuccess(){
		this._hide('formpanel');
		this._show('successpanel');
		this._enable('emailinput');
		this._enable('btn');
		this._hideHourglass();
		this._clearErrorLabel();
	}

	displayError(event_error){
		this._show('formpanel');
		this._hide('successpanel');
		this._enable('emailinput');
		this._enable('btn');
		this._hideHourglass();
		this._showErrors(event_error);
	}

	attemptGetEmail(){
		return this._items['emailinput'].data.getFieldValue();
	}

	constructor(params){
		super(params);
		this._language = params.language;
	}
}

export class KoiFormResetPassword extends KoiOperationsInterceptable(
	KoiSocketConnectable(
		KoiControlConnectorInteractable(
			KoiBaseControl
		)
	)
) {

	static getTagName(){
		return 'koi-form-resetpassword';
	}

	static getTag({element_id, reset_password_connector}){
		let tag_name = this.getTagName();
		return '<' + tag_name + 
			' id="' + element_id + 
			'" provider_id="' + reset_password_connector + 
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
		return new KoiFormResetPasswordSocket({
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

	_updateResetPasswordProvider(event_detail){
		this._connector.attemptResetPassword({
			email: this.socket.attemptGetEmail()
		});
	}

	_updateSomethingWhenOperated(event_detail){
		super._updateSomethingWhenOperated(event_detail);
		this._updateResetPasswordProvider(event_detail);
	}

}
