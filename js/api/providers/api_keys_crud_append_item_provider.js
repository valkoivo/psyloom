/**
 * @module APIKeysCRUDAppendItemProvider
 * 
 * id обязателен
 * save_url обязателен
*/

import { KoiAPIProvider, KoiAPISaveable } from "../../../libs/web-components-lib/providers/api_provider.js";
import { ApiKeyData } from "../api_key_data_object.js";
import { KoiSingleConnector } from "./../../../libs/web-components-lib/connector.js";
import { BloggerUserConnector } from "./../../blogger/providers/blogger_user_api_provider.js";
import { KoiSaveProviderBloggerUserDataConnectorInteractable } from "./../../blogger/blogger_user_data.js";

export class APIKeysCRUDAppendItemProvider extends KoiAPISaveable(
	KoiSaveProviderBloggerUserDataConnectorInteractable(
		KoiAPIProvider
	)
) {

	static getTagName(){
		return 'api-keys-crud-append-item-provider';
	}

	static getTag({
		element_id,
		load_url,
		save_url,
		user_connector
	}){
		const tag_name = this.getTagName();
		return '<' + tag_name + 
			' id="' + element_id + 
			'" load_url="' + load_url + 
			'" save_url="' + save_url + 
			'" provider_id="' + user_connector + 
			'"></' + tag_name + '>';
	}

	getQuerySaveParams(new_values){
		return this._getQuerySaveParams({
			method: 'POST',
			token: this._connector._item.data.getToken(),
			new_values: new_values
		});
	}

	_updadeOwnDataBeforeSaveAPI(new_data){
		this.data.clearValues();
	}

	applySaveAPIDataToModelData(new_values){
		this.data.setValues(new_values);
	}

	_onConstructed(){
		super._onConstructed();
	}

	_constructData(){
		return new ApiKeyData();
	}

	_constructConnector(){
		return new BloggerUserConnector({
			holder: this, 
			id: this._getProviderId()
		});
	}

	_updateSomethingWhenConnectorDataChanged(event_detail){
		super._updateSomethingWhenConnectorDataChanged(event_detail);
		// console.log(this._connector._item.data.getLanguage());
	}

	_updateSomethingWhenConnected(){
		super._updateSomethingWhenConnected();
		// console.log(this._connector._item.data.getLanguage());
	}

	_constructChangedEvent(){
		return new CustomEvent('koi-changed', {
			bubbles: true,
			composed: false,
			detail: this._changed_event_details
		});
	}

}

export class APIKeysCRUDAppendItemConnector extends KoiSingleConnector {

	attemptSaveAPI(data){
		this._item.attemptSaveAPI(data);
	}

}


