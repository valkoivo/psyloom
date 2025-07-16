/**
 * @module ApiV1QueryData
 * This is an item data object for the ApiKey CRUD panel.
 * It represents a single item in CRUDData.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { KoiDataElementString, KoiDataElementDate, KoiDataElementInteger, KoiDataElementBoolean, KoiJSONable }  from "../../libs/web-components-lib/data_element.js";
import { KoiData }  from "../../libs/web-components-lib/data.js";

export class ApiV1QueryData extends KoiData {

	getApiKey(){
		return this._getValueOrDefaultValue('apikey');
	}

	setApiKey(new_api_key){
		this._properties['apikey'].setValue(new_api_key);
	}

	setPersonId(new_person_id){
		this._properties['person_id'].setValue(new_person_id);
	}

	getContext(){
		return this._getValueOrDefaultValue('context');
	}

	setContext(new_context){
		this._properties['context'].setValue(new_context);
	}

	getPerspective(){
		return this._getValueOrDefaultValue('perspective');
	}

	setPerspective(new_perspective){
		this._properties['perspective'].setValue(new_perspective);
	}

	getMode(){
		return this._getValueOrDefaultValue('mode');
	}

	setMode(new_mode){
		this._properties['mode'].setValue(new_mode);
	}

	getPrompt(){
		return this._getValueOrDefaultValue('prompt');
	}

	setPrompt(new_prompt){
		this._properties['prompt'].setValue(new_prompt);
	}

	getResponse(){
		return this._getValueOrDefaultValue('response');
	}

	setValues(new_values){
		for(let key in this._properties){
			if(new_values.hasOwnProperty(key)){
				this._properties[key].setValue(new_values[key]);
			}
		}
	}

	clearValues(){
		for(let key in this._properties){
			this._properties[key]._clearRawValue();
		}
	}

	getRawValuesAsDict(){
		let dict = {};
		for(let key in this._properties){
			dict[key] = this._properties[key].getRawValue();
		}
		return dict;
	}

	getValuesAsDict(){
		let dict = {};
		for(let key in this._properties){
			dict[key] = this._properties[key].getValueOrDefaultValue();
		}
		return dict;
	}

	constructProperties(){
		this._properties = {
			apikey: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'key',
				default_value: null,
				allow_empty: true
			}),
			person_id: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'person_id',
				default_value: null,
				allow_empty: true
			}),
			context: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'context',
				default_value: null,
				allow_empty: true
			}),
			prompt: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'prompt',
				default_value: null,
				allow_empty: true
			}),
			mode: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'mode',
				default_value: 'dialogue',
				allow_empty: true
			}),
			perspective: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'perspective',
				default_value: 'first_person',
				allow_empty: true
			}),
			response: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'response',
				default_value: null,
				allow_empty: true
			})
		};
	}

}
/*
export const ApiKeyDataConnectorInteractable = Sup => class extends KoiControlConnectorInteractable(Sup) {

	_getItemPropertiesFromConnectorEventDetail(event_detail){
		return event_detail.data.getItemProperties();
	}

	_attemptChangeName(new_name){
		this._connector.attemptChangeName(new_name);
	}

	_attemptDeleteItem(){
		this._connector.attemptDeleteItem();
	}

	_constructConnector(){
		return new ApiKeyItemDataConnector({
			holder: this, 
			id: this._getProviderId()
		});
	}

}
*/