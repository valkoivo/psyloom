/**
 * @module APIV1AudienceProcessIdProvider
 * This is a sample provider for CRUD Panel.
 * It pretends to be saving item data, but is actually using a timer 
 * to simulate the behavior of a request to the server.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { ApiV1AudienceData } from "../api_v1_audience_data_object.js";
import { KoiState } from "../../../libs/web-components-lib/state.js";
import { KoiProvider } from "../../../libs/web-components-lib/providers/provider.js";
import { KoiAPISaveable } from "../../../libs/web-components-lib/providers/api_provider.js";

export class APIV1AudienceProvider extends KoiAPISaveable(
	KoiProvider
) {

	static getTagName(){
		return 'api-v1-audience-provider';
	}

	static getTag({
		element_id,
		save_url,
		debug_mode
	}){
		let tag_name = this.getTagName();
		let str_debug_mode = debug_mode ? 'debug_mode="true"' : '';
		return '<' + tag_name + 
			' id="' + element_id + 
			'" save_url="' + save_url + 
			'" ' + str_debug_mode +
			'></' + tag_name + '>';
	}

/*
	_getOwnStateCodeBasedOnOwnData(){
		if(!this.data.hasAllValues()){
			return KoiState.getLoadingCode();
		}
		return super._getOwnStateCodeBasedOnOwnData();
	}
*/

	getQuerySaveParams(new_values){
		return this._getQuerySaveParams({
			method: 'POST', 
			new_values,
			token: this.data.getApiKey()
		});
	}

	_constructData(){
		return new ApiV1AudienceData();
	}

	onSaveAPIError({status, error_data}){
		super.onSaveAPIError({status, error_data});
	}

	applySaveAPIErrorData(error_data){
		this.data.setValues({
			response: JSON.stringify(error_data)
		});
	}

	applySaveAPIDataToModelData(new_values){
		super.applySaveAPIDataToModelData(new_values);
		this.data.setValues({
			response: JSON.stringify(new_values)
		});
	}

	applySaveAPIErrorState(response_status, error_data){
		super.applySaveAPIErrorState(response_status, error_data);
		this._state.setError(
			error_data.message ? error_data.message : error_data.error
		);
	}

}
