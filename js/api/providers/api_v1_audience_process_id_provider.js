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

import { ApiV1AudienceProcessIdData } from "../api_v1_audience_process_id_data_object.js";
import { KoiState } from "../../../libs/web-components-lib/state.js";
import { KoiAPIProvider } from "../../../libs/web-components-lib/providers/api_provider.js";

export class APIV1AudienceProcessIdProvider extends KoiAPIProvider {

	static getTagName(){
		return 'api-v1-audience-process-id-provider';
	}

	static getTag({
		element_id,
		load_url,
		debug_mode
	}){
		let tag_name = this.getTagName();
		let str_debug_mode = debug_mode ? 'debug_mode="true"' : '';
		return '<' + tag_name + 
			' id="' + element_id + 
			'" load_url="' + load_url + 
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

	getQueryLoadParams(filter_data){
		return this._getQueryLoadParams({
			method: 'GET',
			filter_data,
			token: this.data.getApiKey()
		});
	}

	getQueryLoadURL(filter_data){
		return this._load_url + this.data.getProcessId();
	}

	_constructData(){
		return new ApiV1AudienceProcessIdData();
	}

	convertLoadAPIDataToModelData(api_data){
		return super.convertLoadAPIDataToModelData(api_data);
	}

	onLoadAPIError({status, error_data}){
		super.onLoadAPIError({status, error_data});
	}

	clearModelDataOnLoadError(error_data){
		this.data.setValues({
			response: JSON.stringify(error_data)
		});
	}

	applyLoadAPIDataToModelData(new_values){
		this.data.setValues({
			response: JSON.stringify(new_values)
		});
	}

	applyLoadAPIErrorState(response_status, error_data){
		super.applyLoadAPIErrorState(response_status);
		this._state.setError(
			error_data.message ? error_data.message : error_data.error
		);
	}
}
