/**
 * @module DemoFormLogin
 * 
 * id обязателен
 * model - user_model
*/

import { KoiFormLogin, KoiFormLoginSocket } from "../../../../libs/web-components-lib/controls/forms/control_form_login.js";
import { DemoUserConnector, DemoUserAPIProvider } from "../../providers/demo_user_api_provider.js";

import { DemoAuthModeSwitcherLink } from "../buttons/demo_auth_mode_switcher_link.js";
if (customElements.get(DemoAuthModeSwitcherLink.getTagName()) === undefined) {
	customElements.define(DemoAuthModeSwitcherLink.getTagName(), DemoAuthModeSwitcherLink);
}

export class DemoFormLoginSocket extends KoiFormLoginSocket {

	// TODO - Проверить, как выводятся сообщения об ошибках
	// там пишется bad credentials, или что-то другое?

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
					el_class: 'modal-switcher-button active'
				}) +
				DemoAuthModeSwitcherLink.getTag({
					element_id: this._holder.id + '_to_register_switch',
					item_action: 'register',
					placeholder: this._getRegisterTabText(),
					el_class: 'modal-switcher-button'
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
		'<div id="' + this.getID('authorizedpanel') + '">' +
			this.getSuccessText() +
		'</div>';
	}

}

export class DemoFormLogin extends KoiFormLogin {

	static getTagName(){
		return 'demo-form-login';
	}

	_constructConnector(){
		return new DemoUserConnector({
			holder: this, 
			id: this._getProviderId()
		});
	}

	_constructSocket(){
		return new DemoFormLoginSocket({
			holder: this,
			language: this._connector._item.data.getLanguage()
		});
	}

}
