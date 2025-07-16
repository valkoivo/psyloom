/**
 * @module DemoUserAPIProvider
 * 
 * id обязателен
 * url обязателен
*/

import { KoiState } from "./../../../libs/web-components-lib/state.js";
// import { KoiLocalStorable } from "./../../../libs/web-components-lib/local_storage.js";
import { KoiStorable } from "./../../../libs/web-components-lib/session_storage.js";
import { KoiSingleConnector } from "./../../../libs/web-components-lib/connector.js";
import { KoiAPIProviderSelfLoading, KoiAPISaveable } from "./../../../libs/web-components-lib/providers/api_provider.js";
import { DemoUserData } from "./../demo_user_data.js";

export class DemoUserAPIProvider extends KoiStorable(
	KoiAPISaveable(
		KoiAPIProviderSelfLoading
	)
) {

	static getTagName(){
		return 'demo-user-api-provider';
	}

	static getTag({
		element_id,
		debug_mode,
		element_class,
		load_url,
		save_url
	}){
		let tag_name = this.getTagName();
		let str_id = element_id ? ' id="' + element_id + '"' : '';
		let str_debug = debug_mode ? ' debug_mode="true"' : '';
		let str_class = element_class ? ' class="' + element_class + '"' : '';
		let str_load_url = load_url ? ' load_url="' + load_url + '"' : '';
		let str_save_url = save_url ? ' save_url="' + save_url + '"' : '';
		return '<' + tag_name + str_id + str_debug + str_class + str_save_url + str_load_url + '></' + tag_name + '>';
	}

	attemptLogout(){
		this.data.setValues({
			id: null,
			token: null,
			name: null
		});
		this._setStateCode(KoiState.getErrorCode());
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
	}

	_keepExistingTokenIfAuthorized(api_data){
		if(!api_data.data.hasOwnProperty('token')){
			api_data.data['token'] = this.data.getToken();
		}
	}

	convertLoadAPIDataToModelData(api_data){
		this._keepExistingTokenIfAuthorized(api_data);
		return api_data.data;
	}

	convertSaveAPIDataToModelData(api_data){
		this._keepExistingTokenIfAuthorized(api_data);
		return api_data.data;
	}

	applyLoadAPIDataToModelData(new_values){
		this.data.setValues(new_values);
	}

	applySaveAPIDataToModelData(new_values){
		this.data.setValues(new_values);
	}

	getQuerySaveParams(new_values){
		return {
			method: 'POST',
			// mode: 'no-cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			},
			redirect: 'manual',
			referrerPolicy: 'no-referrer',
			body: new URLSearchParams(new_values)
		}
	}

	getErrorStatusesThatMeanNotauthorized(){
		return [401, 404, 422, 500];
	}

	isLoadAPIErrorLoggingNeeded(response_status){
		return !this.getErrorStatusesThatMeanNotauthorized().includes(response_status);
	}

	isSaveAPIErrorLoggingNeeded(response_status){
		return !this.getErrorStatusesThatMeanNotauthorized().includes(response_status);
	}

	getQueryLoadParams(filter_data){
		return this._getQueryLoadParams({
			method: 'GET',
			token: this.data.getToken()
		});
	}

	attemptLoadAPI(filter_data){
		super.attemptLoadAPI(filter_data);
	}

	attemptSwitchLanguage(){
		this.data.switchLanguage();
		this._state.setChanged();
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
	}

	static getUserChangedEventCode(){
		return 'koi-user-changed';
	}

	_constructChangedEvent(){
		return new CustomEvent(DemoUserAPIProvider.getUserChangedEventCode(), {
			bubbles: true,
			composed: false,
			detail: this._changed_event_details
		});
	}

	_constructData(){
		return new DemoUserData();
	}

}

export class DemoUserConnector extends KoiSingleConnector {

	_getChangedEventCode() {
		return DemoUserAPIProvider.getUserChangedEventCode();
	}

	attemptSaveAPI(data){
		this._item.attemptSaveAPI(data);
	}

	onSaveAPISuccess(data){
		this._item.onSaveAPISuccess(data);
	}

	getLanguage(){
		return this._item.data.getLanguage();
	}

}
