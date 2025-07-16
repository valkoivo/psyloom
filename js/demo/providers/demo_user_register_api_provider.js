/**
 * @module DemoUserRegisterAPIProvider
 * 
 * id обязателен
 * load_url, save_url обязателен
 * user_connector
*/

import { KoiSingleConnectorInteractable } from "../../../libs/web-components-lib/connector.js";
import { KoiAPISaveable, KoiAPIProvider } from "../../../libs/web-components-lib/providers/api_provider.js";
import { DemoUserRegisterData } from "../demo_user_register_data.js";
import { DemoUserConnector } from "./demo_user_api_provider.js";

export class DemoUserRegisterAPIProvider extends KoiAPISaveable(
	KoiSingleConnectorInteractable(
		KoiAPIProvider
	)
) {

	static getTagName(){
		return 'demo-user-register-api-provider';
	}

	static getTag({element_id, load_url, save_url, user_connector}){
		let tag_name = this.getTagName();
		return '<' + tag_name + ' id="' + element_id + 
			'" load_url="' + load_url + 
			'" save_url="' + save_url + 
			'" provider_id="' + user_connector + 
			'"></' + tag_name + '>';
	}

	applySaveAPIErrorData(error_data){
		if(error_data.hasOwnProperty('errors')){
			this._state.setError(error_data);
		}else if(error_data.hasOwnProperty('message')){
			this._state.setError({'form': [error_data.message]});
		}
	}

	onSaveAPISuccess(success_data){
		super.onSaveAPISuccess(success_data);
		this._connector.onSaveAPISuccess(success_data);
	}

	attemptRegister(new_data){
		this.attemptSaveAPI(new_data);
	}

	getErrorStatusesThatMeanNotauthorized(){
		return [401, 422, 500];
	}

	isSaveAPIErrorLoggingNeeded(response_status){
		return !this.getErrorStatusesThatMeanNotauthorized().includes(response_status);
	}

	_constructData(){
		return new DemoUserRegisterData();
	}

	static getUserChangedEventCode(){
		return 'koi-user-register-changed';
	}

	_constructChangedEvent(){
		return new CustomEvent(DemoUserRegisterAPIProvider.getUserChangedEventCode(), {
			bubbles: true,
			composed: false,
			detail: this._changed_event_details
		});
	}

	_onConstructed(){
		super._onConstructed();
	}

	_constructConnector(){
		return new DemoUserConnector({
			holder: this, 
			id: this._getProviderId()
		});
	}

	_attemptApplyConnectorDataChanged(event){
		super._attemptApplyConnectorDataChanged(event);
	}

	_dispatchChangedEventWhenConnectorDataChanged(){
		super._dispatchChangedEventWhenConnectorDataChanged();
		this.dispatchEvent(this._changed_event);
	}

	_shouldApplyConnectorStateCodeToOwnStateCode(){
		return false;
	}

	_onBeforeConnected(){
		super._onBeforeConnected();
	}

}
