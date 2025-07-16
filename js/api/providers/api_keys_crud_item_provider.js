/**
 * @module APIKeysCRUDItemProvider
 * This is a sample provider for CRUD Panel.
 * It pretends to be saving item data, but is actually using a timer 
 * to simulate the behavior of a request to the server.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { ApiKeyData } from "../api_key_data_object.js";
import { KoiState } from "../../../libs/web-components-lib/state.js";
import { KoiProvider } from "../../../libs/web-components-lib/providers/provider.js";
import { KoiAPISaveable, KoiAPIDeletable } from "../../../libs/web-components-lib/providers/api_provider.js";
import { BloggerUserConnector } from "./../../blogger/providers/blogger_user_api_provider.js";
import { KoiSaveProviderBloggerUserDataConnectorInteractable } from "./../../blogger/blogger_user_data.js";

import { KoiDataElementString, KoiDataElementInteger, KoiDataElementBoolean, KoiDataElementDate, KoiJSONable }  from "../../../libs/web-components-lib/data_element.js";

export class APIKeysCRUDItemProvider extends KoiAPIDeletable(
	KoiAPISaveable(
		KoiSaveProviderBloggerUserDataConnectorInteractable(
			KoiProvider
		)
	)
) {

	static getTagName(){
		return 'api-keys-crud-item-provider';
	}

	static getTag({
		element_id,
		load_url,
		save_url,
		item_id,
		item_name,
		apikey,
		user_id,
		deleted_at,
		debug_mode,
		user_connector
	}){
		let tag_name = this.getTagName();
		let _item_id = KoiDataElementInteger.canConvertToAttribute(item_id) ? 
			'item_id="' + KoiDataElementInteger.convertToAttribute(item_id) + '"' : '';
		let _item_name = (KoiJSONable(KoiDataElementString)).canConvertToAttribute(item_name) ? 
			'item_name="' + (KoiJSONable(KoiDataElementString)).convertToAttribute(item_name) + '"' : '';
		let _apikey = (KoiJSONable(KoiDataElementString)).canConvertToAttribute(apikey) ? 
			'apikey="' + (KoiJSONable(KoiDataElementString)).convertToAttribute(apikey) + '"' : '';
		let _deleted_at = KoiDataElementDate.canConvertToAttribute(deleted_at) ? 
			'deleted_at="' + KoiDataElementDate.convertToAttribute(deleted_at) + '"' : '';
		let str_debug_mode = debug_mode ? 'debug_mode="true"' : '';
		return '<' + tag_name + 
			' id="' + element_id + 
			'" ' + _apikey + 
			' user_id="' + user_id + 
			'" load_url="' + load_url + 
			'" save_url="' + save_url + 
			'" ' + _item_id + 
			' ' + _item_name + 
			' ' + _deleted_at + 
			' ' + str_debug_mode +
			' provider_id="' + user_connector + 
			'"></' + tag_name + '>';
	}

	_getOwnStateCodeBasedOnOwnData(){
		if(!this.data.hasAllValues()){
			return KoiState.getLoadingCode();
		}
		return super._getOwnStateCodeBasedOnOwnData();
	}

	_constructData(){
		return new ApiKeyData();
	}

	getQuerySaveParams(new_values){
		return this._getQuerySaveParams({
			method: 'PATCH',
			token: this._connector._item.data.getToken(),
			new_values: new_values
		});
	}

	getQueryDeleteParams(new_values){
		return this._getQueryDeleteParams({
			method: 'DELETE',
			token: this._connector._item.data.getToken(),
			new_values: new_values
		});
	}

	applySaveAPIDataToModelData(new_values){
		this.data.setValues(new_values);
	}

	applyDeleteAPIDataToModelData(new_values){
		this.data.setValues(new_values);
	}

	attemptChangeItemName(item_name){
		if(!this.isReady()){
			return;
		}
		this.attemptSaveAPI({
			id: this.data.getItemId(),
			name: item_name
		});
	}

	attemptDeleteItem(){
		if(!this.isReady()){
			return;
		}
		this.attemptDeleteAPI({
			id: this.data.getItemId()
		});
	}

	_constructConnector(){
		return new BloggerUserConnector({
			holder: this, 
			id: this._getProviderId()
		});
	}

}
