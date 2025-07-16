/**
 * @module DemoFormRegister
 * 
 * id обязателен
 * connector - user_model
*/

import { KoiSingleConnector } from "../../../../libs/web-components-lib/connector.js";
import { KoiFormRegister, KoiFormRegisterSocket } from "../../../../libs/web-components-lib/controls/forms/control_form_register.js";
import { DemoUserRegisterAPIProvider } from "../../providers/demo_user_register_api_provider.js";

import { DemoAuthModeSwitcherLink } from "../buttons/demo_auth_mode_switcher_link.js";
if (customElements.get(DemoAuthModeSwitcherLink.getTagName()) === undefined) {
	customElements.define(DemoAuthModeSwitcherLink.getTagName(), DemoAuthModeSwitcherLink);
}

import { KoiFormFieldString } from "../../../../libs/web-components-lib/controls/forms/control_form_field_string.js";
if (customElements.get(KoiFormFieldString.getTagName()) === undefined) {
	customElements.define(KoiFormFieldString.getTagName(), KoiFormFieldString);
}
import { KoiFormFieldTextarea } from "../../../../libs/web-components-lib/controls/forms/control_form_field_textarea.js";
if (customElements.get(KoiFormFieldTextarea.getTagName()) === undefined) {
	customElements.define(KoiFormFieldTextarea.getTagName(), KoiFormFieldTextarea);
}
import { KoiFormFieldPassword } from "../../../../libs/web-components-lib/controls/forms/control_form_field_password.js";
if (customElements.get(KoiFormFieldPassword.getTagName()) === undefined) {
	customElements.define(KoiFormFieldPassword.getTagName(), KoiFormFieldPassword);
}
import { KoiIdButton } from "../../../../libs/web-components-lib/controls/buttons/control_idbutton.js";
if (customElements.get(KoiIdButton.getTagName()) === undefined) {
	customElements.define(KoiIdButton.getTagName(), KoiIdButton);
}
import { KoiLabel } from "../../../../libs/web-components-lib/controls/labels/control_label.js";
if (customElements.get(KoiLabel.getTagName()) === undefined) {
	customElements.define(KoiLabel.getTagName(), KoiLabel);
}

export class DemoFormRegisterSocket extends KoiFormRegisterSocket {

	_getEmptySchemaIds(){
		return {
			formpanel: this._holder.id + '_formpanel',
			authorizedpanel: this._holder.id + '_authorizedpanel',
			nameinput: this._holder.id + '_nameinput',
			logininput: this._holder.id + '_logininput',
			passwordinput: this._holder.id + '_passwordinput',
			password_confirmationinput: this._holder.id + '_password_confirmationinput',
			company_name_input: this._holder.id + '_company_name_input',
			company_type_input: this._holder.id + '_company_type_input',
			company_link_input: this._holder.id + '_company_link_input',
			company_purpose_input: this._holder.id + '_company_purpose_input',
			btn: this._holder.id + '_btn',
			errorlabel: this._holder.id + '_errorlabel'
		};
	}

	_getNamePlaceholder(){
		if(this._language == 'english'){
			return 'Your Name';
		}else if(this._language == 'russian'){
			return 'Имя';
		}
	}

	_getCompanyNamePlaceholder(){
		if(this._language == 'english'){
			return 'Company Name';
		}else if(this._language == 'russian'){
			return 'Название компании';
		}
	}

	_getCompanyTypePlaceholder(){
		if(this._language == 'english'){
			return 'What does your company do?';
		}else if(this._language == 'russian'){
			return 'Чем занимается компания';
		}
	}

	_getCompanyLinkPlaceholder(){
		if(this._language == 'english'){
			return 'Company Website or Social Profile';
		}else if(this._language == 'russian'){
			return 'Ссылка на сайт компании';
		}
	}

	_getCompanyPurposePlaceholder(){
		if(this._language == 'english'){
			return 'How does your company use AI agents?';
		}else if(this._language == 'russian'){
			return 'Как компания использует ИИ-агентов';
		}
	}

	_getFieldsetTemplate(){
		return KoiLabel.getTag({
			element_id: this.getID('errorlabel'),
			value: ''
		}) +
		'<h3>Tell us about your company</h3>' +
		KoiFormFieldString.getTag({
			element_id: this.getID('nameinput'),
			field_name: 'name',
			placeholder: this._getNamePlaceholder(),
			element_class: 'mb-3 d-block'
		}) +
		KoiFormFieldString.getTag({
			element_id: this.getID('company_name_input'),
			field_name: 'company_name',
			placeholder: this._getCompanyNamePlaceholder(),
			element_class: 'mb-3 d-block'
		}) +
		KoiFormFieldString.getTag({
			element_id: this.getID('company_type_input'),
			field_name: 'company_type',
			placeholder: this._getCompanyTypePlaceholder(),
			element_class: 'mb-3 d-block'
		}) +
		KoiFormFieldString.getTag({
			element_id: this.getID('company_link_input'),
			field_name: 'company_link',
			placeholder: this._getCompanyLinkPlaceholder(),
			element_class: 'mb-3 d-block'
		}) +
		KoiFormFieldTextarea.getTag({
			element_id: this.getID('company_purpose_input'),
			field_name: 'company_purpose',
			placeholder: this._getCompanyPurposePlaceholder(),
			element_class: 'mb-3 d-block'
		}) +
		'<h3>Create your login credentials</h3>' +
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

	_clearErrorLabel(){
		this._items['errorlabel'].hide();
		this._items['nameinput'].socket.removeError();
		this._items['logininput'].socket.removeError();
		this._items['passwordinput'].socket.removeError();
		this._items['password_confirmationinput'].socket.removeError();
		this._items['company_name_input'].socket.removeError();
		this._items['company_type_input'].socket.removeError();
		this._items['company_link_input'].socket.removeError();
		this._items['company_purpose_input'].socket.removeError();
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
			if('company_name' in event_error['errors']){
				this._items['company_name_input'].socket.displayError(event_error['errors']['company_name'].join(' '));
			}else{
				this._items['company_name_input'].socket.removeError();
			}
			if('company_type' in event_error['errors']){
				this._items['company_type_input'].socket.displayError(event_error['errors']['company_type'].join(' '));
			}else{
				this._items['company_type_input'].socket.removeError();
			}
			if('company_link' in event_error['errors']){
				this._items['company_link_input'].socket.displayError(event_error['errors']['company_link'].join(' '));
			}else{
				this._items['company_link_input'].socket.removeError();
			}
			if('company_purpose' in event_error['errors']){
				this._items['company_purpose_input'].socket.displayError(event_error['errors']['company_purpose'].join(' '));
			}else{
				this._items['company_purpose_input'].socket.removeError();
			}
		}else if(event_error && event_error.hasOwnProperty('message')){
			this._items['errorlabel'].show();
			this._items['errorlabel'].attemptChangeValue(event_error['message']);
			this._items['nameinput'].socket.removeError();
			this._items['logininput'].socket.removeError();
			this._items['passwordinput'].socket.removeError();
			this._items['password_confirmationinput'].socket.removeError();
			this._items['company_name_input'].socket.removeError();
			this._items['company_type_input'].socket.removeError();
			this._items['company_link_input'].socket.removeError();
			this._items['company_purpose_input'].socket.removeError();
		}else if(event_error && event_error.hasOwnProperty('form')){
			this._items['errorlabel'].show();
			this._items['errorlabel'].attemptChangeValue(event_error['form']);
			this._items['nameinput'].socket.removeError();
			this._items['logininput'].socket.removeError();
			this._items['passwordinput'].socket.removeError();
			this._items['password_confirmationinput'].socket.removeError();
			this._items['company_name_input'].socket.removeError();
			this._items['company_type_input'].socket.removeError();
			this._items['company_link_input'].socket.removeError();
			this._items['company_purpose_input'].socket.removeError();
		}else if(event_error){
			this._items['errorlabel'].show();
			this._items['errorlabel'].attemptChangeValue(event_error);
			this._items['nameinput'].socket.removeError();
			this._items['logininput'].socket.removeError();
			this._items['passwordinput'].socket.removeError();
			this._items['password_confirmationinput'].socket.removeError();
			this._items['company_name_input'].socket.removeError();
			this._items['company_type_input'].socket.removeError();
			this._items['company_link_input'].socket.removeError();
			this._items['company_purpose_input'].socket.removeError();
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
		this._enable('company_name_input');
		this._enable('company_type_input');
		this._enable('company_link_input');
		this._enable('company_purpose_input');
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
		this._disable('company_name_input');
		this._disable('company_type_input');
		this._disable('company_link_input');
		this._disable('company_purpose_input');
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
		this._enable('company_name_input');
		this._enable('company_type_input');
		this._enable('company_link_input');
		this._enable('company_purpose_input');
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
		this._enable('company_name_input');
		this._enable('company_type_input');
		this._enable('company_link_input');
		this._enable('company_purpose_input');
		this._enable('btn');
		this._hideHourglass();
		this._showErrors(event_error);
	}

	_getLoginTabText(){
		if(this._language == 'english'){
			return 'Login';
		}else if(this._language == 'russian'){
			return 'Вход';
		}
	}

	_getRegisterTabText(){
		if(this._language == 'english'){
			return 'Register';
		}else if(this._language == 'russian'){
			return 'Регистрация';
		}
	}

	_getRecoverTabText(){
		if(this._language == 'english'){
			return 'Forgot password?';
		}else if(this._language == 'russian'){
			return 'Забыли пароль?';
		}
	}

	getTemplate(){
		return '<div class="modal-switcher">' +
			'<div class="modal-switcher-contents">' +
				DemoAuthModeSwitcherLink.getTag({
					element_id: this._holder.id + '_to_login_switch',
					item_action: 'login',
					placeholder: this._getLoginTabText(),
					el_class: 'modal-switcher-button'
				}) +
				DemoAuthModeSwitcherLink.getTag({
					element_id: this._holder.id + '_to_register_switch',
					item_action: 'register',
					placeholder: this._getRegisterTabText(),
					el_class: 'modal-switcher-button active'
				}) +
			'</div>' +
		'</div>' +
		'<div id="' + this.getID('formpanel') + '" class="modal-form-panel mt-3">' +
			'<form onsubmit="event.preventDefault();">' +
				'<fieldset>' +
					this._getFieldsetTemplate() +
				'</fieldset>' +
			'</form>' +
			/*
			'<div class="mt-4 mb-3 text-center">' +
				DemoAuthModeSwitcherLink.getTag({
					element_id: this._holder.id + '_to_recover',
					item_action: 'recover',
					placeholder: this._getRecoverTabText(),
					btn_class: 'btn-link p-0 align-baseline',
					el_class: 'modal-switcher-forgot'
				}) +
			'</div>' +
			*/
		'</div>' +
		'<div id="' + this.getID('authorizedpanel') + '" class="d-none">' +
			this.getSuccessText() +
		'</div>';
	}

	attemptGetCompanyName(){
		return this._items['company_name_input'].data.getFieldValue();
	}
	attemptGetCompanyType(){
		return this._items['company_type_input'].data.getFieldValue();
	}
	attemptGetCompanyLink(){
		return this._items['company_link_input'].data.getFieldValue();
	}
	attemptGetCompanyPurpose(){
		return this._items['company_purpose_input'].data.getFieldValue();
	}
}

export class DemoUserRegisterConnector extends KoiSingleConnector {

	_getChangedEventCode() {
		return DemoUserRegisterAPIProvider.getUserChangedEventCode();
	}

	attemptRegister(data){
		this._item.attemptRegister(data);
	}

	onSaveAPISuccess(data){
		this._item.onSaveAPISuccess(data);
	}

}

export class DemoFormRegister extends KoiFormRegister {

	static getTagName(){
		return 'demo-form-register';
	}

	_constructConnector(){
		return new DemoUserRegisterConnector({
			holder: this, 
			id: this._getProviderId()
		});
	}

	_constructSocket(){
		return new DemoFormRegisterSocket({
			holder: this,
			language: this._connector._item._connector._item.data.getLanguage()
		});
	}

	_attemptApplyConnectorDataChanged(event){
		super._attemptApplyConnectorDataChanged(event);
	}

	_subscribeToEvents(){
		super._subscribeToEvents();
	}

	_onBeforeConnected(){
		super._onBeforeConnected();
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
			preferred_language: this._connector._item._connector.getLanguage(),
			company_name: this.socket.attemptGetCompanyName(),
			company_type: this.socket.attemptGetCompanyType(),
			company_link: this.socket.attemptGetCompanyLink(),
			company_purpose: this.socket.attemptGetCompanyPurpose()
		});
	}

}
