/**
 * @module DemoAuthPanel
 * Расширяемая панель для переключения между 
 * формами авторизации, регистрации и сброса пароля.
 * 
 */

import { KoiSocketConnectable, KoiBaseControl, KoiControlConnectorInteractable } from "../../../../libs/web-components-lib/controls/control.js";
import { KoiCompositeSocket, KoiSocketTemplateCapable } from "../../../../libs/web-components-lib/socket.js";
import { KoiOperationsInterceptable } from "../../../../libs/web-components-lib/event_operated.js";
import { KoiChangedEventDispatchable } from "../../../../libs/web-components-lib/event_changed.js";
import { KoiStringData, KoiStringDataCapable } from "../../../../libs/web-components-lib/data_objects.js";
import { DemoUserConnector } from "../../providers/demo_user_api_provider.js";

import { DemoFormLogin } from "../forms/demo_form_login.js";
if (customElements.get(DemoFormLogin.getTagName()) === undefined) {
	customElements.define(DemoFormLogin.getTagName(), DemoFormLogin);
}
import { DemoUserRegisterAPIProvider } from "../../providers/demo_user_register_api_provider.js";
if (customElements.get(DemoUserRegisterAPIProvider.getTagName()) === undefined) {
	customElements.define(DemoUserRegisterAPIProvider.getTagName(), DemoUserRegisterAPIProvider);
}
import { DemoFormRegister } from "../forms/demo_form_register.js";
if (customElements.get(DemoFormRegister.getTagName()) === undefined) {
	customElements.define(DemoFormRegister.getTagName(), DemoFormRegister);
}
/*
import { BloggerUserResetPasswordAPIProvider } from "../../providers/blogger_user_reset_password_api_provider.js";
if (customElements.get(BloggerUserResetPasswordAPIProvider.getTagName()) === undefined) {
	customElements.define(BloggerUserResetPasswordAPIProvider.getTagName(), BloggerUserResetPasswordAPIProvider);
}
import { BloggerFormResetPassword } from "../forms/blogger_form_reset_password.js";
if (customElements.get(BloggerFormResetPassword.getTagName()) === undefined) {
	customElements.define(BloggerFormResetPassword.getTagName(), BloggerFormResetPassword);
}
*/

export class DemoAuthPanelSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds() {
		return {
			login: this._holder.id + "_login_panel",
			register: this._holder.id + "_register_panel",
			recover: this._holder.id + "_recover_panel"
		};
	}

	getTemplate() {
		const register_provider_id = this._holder.id + '_register_provider';
		const reset_password_provider_id = this._holder.id + '_reset_password_provider';
		return '<div id="' + this.getID('login') + '" class="d-none">' +
				DemoFormLogin.getTag({
					user_connector: this._user_connector_id,
					element_id: this._holder.id + '_formlogin'
				}) +
			'</div>' +
			'<div id="' + this.getID('register') + '" class="d-none">' +
				DemoUserRegisterAPIProvider.getTag({
					element_id: register_provider_id,
					load_url: 'https://api.psyloom.com/auth/register-company',
					save_url: 'https://api.psyloom.com/auth/register-company',
					user_connector: this._user_connector_id
				}) +
				DemoFormRegister.getTag({
					element_id: this._holder.id + '_formregister',
					user_register_connector: register_provider_id
				}) +
			'</div>'; /* +
			'<div id="' + this.getID('recover') + '" class="d-none">' +
				BloggerUserResetPasswordAPIProvider.getTag({
					element_id: reset_password_provider_id,
					load_url: '/auth/forgot-password',
					save_url: '/auth/forgot-password',
					user_connector: this._user_connector_id
				}) +
				BloggerFormResetPassword.getTag({
					element_id: this._holder.id + '_formresetpassword',
					reset_password_connector: reset_password_provider_id
				}) +
			'</div>'; */
	}

	_showPanel(key) {
		let ids = this._getEmptySchemaIds();
		for(let panel in ids){
			if(panel === key){
				this._show(panel);
			}else{
				this._hide(panel);
			}
		}
	}

	showLogin(){
		this._showPanel("login");
	}

	showRegister(){
		this._showPanel("register");
	}

	showRecover(){
		this._showPanel("recover");
	}

	showSuccessfulAuth(){
		this._holder.hide();
	}

	showNotAuthorized(){
		this._holder.show();
	}

	prepare() {
		super.prepare();
		this.showRegister();
	}

	constructor({ holder, user_connector_id }) {
		super({ holder });
		this._user_connector_id = user_connector_id;
	}
}

export const DemoAuthPanelSocketConnectable = Sup => class extends KoiSocketConnectable(Sup) {

	_constructSocket(){
		return new DemoAuthPanelSocket({
			holder: this,
			user_connector_id: this.getAttribute('provider_id')
		});
	}

}

export class DemoAuthPanel extends KoiChangedEventDispatchable(
	KoiOperationsInterceptable(
		DemoAuthPanelSocketConnectable(
			KoiStringDataCapable(
				KoiControlConnectorInteractable(
					KoiBaseControl
				)
			)
		)
	)
) {

	static getTagName(){
		return "demo-auth-panel";
	}

	static getTag({
		element_id,
		element_class,
		user_connector
	}){
		let tag_name = this.getTagName();
		let str_id = element_id ? ' id="' + element_id + '"' : '';
		let str_class = element_class ? ' class="' + element_class + '"' : '';
		let str_user_connector = user_connector ? ' provider_id="' + user_connector + '"' : '';
		return '<' + tag_name + str_id + str_class + str_user_connector + '></' + tag_name + '>';
	}

	_getInterceptableOperateEventCode(){
		return "blogger-auth-mode-switch";
	}

	_handleOperated(event_detail){
		let action = event_detail.data.getAction();
		if(action === "register"){
			this.socket.showRegister();
		}else if(action === "recover"){
			this.socket.showRecover();
		}else{
			this.socket.showLogin();
		}
		this.attemptChangeValue(action);
	}

	static getAuthPanelModeChangedEventCode(){
		return 'blogger-auth-panel-mode-switched';
	}

	_displayWaiting(){
		super._displayWaiting();
	}

	_displayBadConnection(){
		super._displayBadConnection();
		this.socket.showNotAuthorized();
	}

	_displayError(){
		super._displayError();
		this.socket.showNotAuthorized();
	}

	_displayForbidden(){
		super._displayForbidden();
		this.socket.showNotAuthorized();
	}

	_updateSocket(){
		super._updateSocket();
		this.socket.showSuccessfulAuth();
	}

	_attemptApplyConnectorDataChanged(event){
		super._attemptApplyConnectorDataChanged(event);
	}

	_constructChangedEvent(){
		return new CustomEvent(DemoAuthPanel.getAuthPanelModeChangedEventCode(), {
			bubbles: true,
			composed: false,
			detail: this._changed_event_details
		});
	}

	_constructConnector(){
		return new DemoUserConnector({
			holder: this, 
			id: this._getProviderId()
		});
	}

}
