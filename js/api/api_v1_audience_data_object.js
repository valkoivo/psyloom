/**
 * @module ApiV1AudienceData
 * This is an item data object for the ApiKey CRUD panel.
 * It represents a single item in CRUDData.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { KoiDataElementString, KoiDataElementDate, KoiDataElementInteger, KoiDataElementBoolean, KoiJSONable }  from "../../libs/web-components-lib/data_element.js";
import { KoiData }  from "../../libs/web-components-lib/data.js";

export class ApiV1AudienceData extends KoiData {

	getDescription(){
		return this._getValueOrDefaultValue('description');
	}

	setDescription(new_description){
		this._properties['description'].setValue(new_description);
	}

	getApiKey(){
		return this._getValueOrDefaultValue('apikey');
	}

	setApiKey(new_api_key){
		this._properties['apikey'].setValue(new_api_key);
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

	constructProperties(){
		this._properties = {
			apikey: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'key',
				default_value: null,
				allow_empty: true
			}),
			description: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'description',
				default_value: null,
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