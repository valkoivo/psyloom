/**
 * @module ApiKeyData
 * This is an item data object for the ApiKey CRUD panel.
 * It represents a single item in CRUDData.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { KoiDataElementString, KoiDataElementDate, KoiDataElementInteger, KoiDataElementBoolean, KoiJSONable }  from "../../libs/web-components-lib/data_element.js";
import { KoiData }  from "../../libs/web-components-lib/data.js";

export class ApiKeyData extends KoiData {

	getItemId(){
		return this._getValueOrDefaultValue('id');
	}

	setItemId(new_id){
		this._properties['id'].setValue(new_id);
	}

	getName(){
		return this._getValueOrDefaultValue('name');
	}

	setName(new_name){
		this._properties['name'].setValue(new_name);
	}

	getKey(){
		return this._getValueOrDefaultValue('apikey');
	}

	setKey(new_key){
		this._properties['apikey'].setValue(new_key);
	}

	getUserId(){
		return this._getValueOrDefaultValue('user_id');
	}

	setUserId(new_user_id){
		this._properties['user_id'].setValue(new_user_id);
	}

	getItemProperties(){
		return {
			id: this._getValueOrDefaultValue('id'),
			name: this._getValueOrDefaultValue('name'),
			apikey: this._getValueOrDefaultValue('apikey'),
			user_id: this._getValueOrDefaultValue('user_id'),
			deleted_at: this._getValueOrDefaultValue('deleted_at')
		};
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

	hasAllValues(){
		for(let key in this._properties){
			if((key != 'deleted_at') && !this._properties[key].hasValue()){
				return false;
			}
		}
		return true;
	}

	constructProperties(){
		this._properties = {
			id: new KoiDataElementInteger({
				localized_name: 'id',
				default_value: null,
				allow_empty: true
			}),
			name: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'name',
				default_value: null,
				allow_empty: true
			}),
			apikey: new (KoiJSONable(KoiDataElementString))({
				localized_name: 'key',
				default_value: null,
				allow_empty: true
			}),
			user_id: new KoiDataElementInteger({
				localized_name: 'user_id',
				default_value: null,
				allow_empty: true
			}),
			deleted_at: new KoiDataElementDate({
				localized_name: 'deleted_at',
				default_value: null,
				allow_empty: true
			})
		};
	}

	setDefaultValuesFromAttributes(element_attributes){
		super.setDefaultValuesFromAttributes(element_attributes);
		if(element_attributes.hasOwnProperty('item_id')){
			this._properties['id'].setDefaultValueFromAttributeValue(element_attributes['item_id'].value);
		}
		if(element_attributes.hasOwnProperty('item_name')){
			this._properties['name'].setDefaultValueFromAttributeValue(element_attributes['item_name'].value);
		}
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