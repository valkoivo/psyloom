/**
 * @module KoiFormRegister
 * 
 * id - required
 * connector - user_model
*/

import { KoiControlConnectorInteractable, KoiSocketConnectable, KoiBaseControl } from "../../../../libs/web-components-lib/controls/control.js";
import { KoiCompositeSocket, KoiSocketTemplateCapable } from "../../../../libs/web-components-lib/socket.js";
import { KoiOperationsInterceptable } from "../../../../libs/web-components-lib/event_operated.js";

import { KoiFormFieldString } from "./control_form_field_string.js";
if (customElements.get('koi-form-field-string') === undefined) {
	customElements.define('koi-form-field-string', KoiFormFieldString);
}
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

export class KoiFormRegisterSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds(){
		return {
			formpanel: this._holder.id + '_formpanel',
			authorizedpanel: this._holder.id + '_authorizedpanel',
			nameinput: this._holder.id + '_nameinput',
			logininput: this._holder.id + '_logininput',
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
		KoiFormFieldString.getTag({
			element_id: this.getID('nameinput'),
			field_name: 'name',
			placeholder: this._getNamePlaceholder(),
			element_class: 'mb-3 d-block'
		}) +
		KoiFormFieldString.getTag({
			element_id: this.getID('logininput'),
			field_name: 'email',
			placeholder: 'Email',
			element_class: 'mb-3 d-block'
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
		return '<div id="' + this.getID('formpanel') + '">' +
			'<form onsubmit="event.preventDefault();">' +
				'<fieldset>' +
					this._getFieldsetTemplate() +
				'</fieldset>' +
			'</form>' +
		'</div>' +
		'<div id="' + this.getID('authorizedpanel') + '">' +
			this.getSuccessText() +
		'</div>';
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
		this._items['nameinput'].socket.removeError();
		this._items['logininput'].socket.removeError();
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
			if('name' in event_error['errors']){
				this._items['nameinput'].socket.displayError(event_error['errors']['name'].join(' '));
			}else{
				this._items['nameinput'].socket.removeError();
			}
			if('email' in event_error['errors']){
				this._items['logininput'].socket.displayError(event_error['errors']['email'].join(' '));
			}else{
				this._items['logininput'].socket.removeError();
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
			this._items['nameinput'].socket.removeError();
			this._items['logininput'].socket.removeError();
			this._items['passwordinput'].socket.removeError();
			this._items['password_confirmationinput'].socket.removeError();
		}else if(event_error){
			this._items['errorlabel'].show();
			this._items['errorlabel'].attemptChangeValue(event_error);
			this._items['nameinput'].socket.removeError();
			this._items['logininput'].socket.removeError();
			this._items['passwordinput'].socket.removeError();
			this._items['password_confirmationinput'].socket.removeError();
		}else{
			this._clearErrorLabel();
		}
	}

	activateForm(){
		this._show('formpanel');
		this._hide('authorizedpanel');
		this._enable('nameinput');
		this._enable('logininput');
		this._enable('passwordinput');
		this._enable('password_confirmationinput');
		this._enable('btn');
		this._hideHourglass();
		this._clearErrorLabel();
	}

	displayLoading(){
		this._show('formpanel');
		this._hide('authorizedpanel');
		this._disable('nameinput');
		this._disable('logininput');
		this._disable('passwordinput');
		this._disable('password_confirmationinput');
		this._disable('btn');
		this._showHourglass();
		this._clearErrorLabel();
	}

	displaySuccess(){
		this._hide('formpanel');
		this._show('authorizedpanel');
		this._enable('nameinput');
		this._enable('logininput');
		this._enable('passwordinput');
		this._enable('password_confirmationinput');
		this._enable('btn');
		this._hideHourglass();
		this._clearErrorLabel();
	}

	displayError(event_error){
		this._show('formpanel');
		this._hide('authorizedpanel');
		this._enable('nameinput');
		this._enable('logininput');
		this._enable('passwordinput');
		this._enable('password_confirmationinput');
		this._enable('btn');
		this._hideHourglass();
		this._showErrors(event_error);
	}

	attemptGetName(){
		return this._items['nameinput'].data.getFieldValue();
	}
	attemptGetLogin(){
		return this._items['logininput'].data.getFieldValue();
	}
	attemptGetPassword(){
		return this._items['passwordinput'].data.getFieldValue();
	}
	attemptGetPasswordConfirmation(){
		return this._items['password_confirmationinput'].data.getFieldValue();
	}

	_getSubmitButtonText(){
		if(this._language == 'english'){
			return 'Register';
		}else if(this._language == 'russian'){
			return 'Зарегистрироваться';
		}
	}

	_getNamePlaceholder(){
		if(this._language == 'english'){
			return 'Name';
		}else if(this._language == 'russian'){
			return 'Имя';
		}
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

	getSuccessText(){
		if(this._language == 'english'){
			return 'Registration successful';
		}else if(this._language == 'russian'){
			return 'Регистрация успешна';
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
			return 'Not authorized for registration';
		}else if(this._language == 'russian'){
			return 'Нет прав для регистрации';
		}
	}

	changeLanguage(language){
		this._language = language;
		this._items['authorizedpanel'].innerHTML = this.getSuccessText();
		// TODO
	}

	constructor(params){
		super(params);
		this._language = params.language;
	}
}

export class KoiFormRegister extends KoiOperationsInterceptable(
	KoiSocketConnectable(
		KoiControlConnectorInteractable(
			KoiBaseControl
		)
	)
) {

	static getTagName(){
		return 'koi-form-register';
	}

	static getTag({element_id, user_register_connector}){
		let tag_name = this.getTagName();
		return '<' + tag_name + 
			' id="' + element_id + 
			'" provider_id="' + user_register_connector + 
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
		this.socket.displayError(
			this._state.getError()
		);
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
		return new KoiFormRegisterSocket({
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

	_changeLanguage(event_detail){
		if(typeof event_detail.data.getLanguage == 'function'){
			this.socket.changeLanguage(event_detail.data.getLanguage());
		}
	}

	_updateSomethingWhenConnectorDataChanged(event_detail){
		super._updateSomethingWhenConnectorDataChanged(event_detail);
		this._changeLanguage(event_detail);
	}

	_updateUserRegisterProvider(event_detail){
		// TODO - Здесь тоже нужно вызвать функцию валидации
		// TODO - В API мы передаем все значения как есть. За корректность запроса
		// отвечает форма. Сейчас значение "незаполнено" (false) передается как строка
		// "false". Форма в момент валидации должна исключать из передаваемого объекта
		// поля, которые имеют значение false.
		// TODO - Язык вытаскиваем некорректно
		this._connector.attemptRegister({
			name: this.socket.attemptGetName(),
			email: this.socket.attemptGetLogin(),
			password: this.socket.attemptGetPassword(),
			password_confirmation: this.socket.attemptGetPasswordConfirmation(),
			preferred_language: this._connector._item._connector.getLanguage()
		});
	}

	_updateSomethingWhenOperated(event_detail){
		super._updateSomethingWhenOperated(event_detail);
		this._updateUserRegisterProvider(event_detail);
	}

}
