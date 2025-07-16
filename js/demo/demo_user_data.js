import { KoiData } from "./../../libs/web-components-lib/data.js";
import { KoiDataElementInteger, KoiDataElementString, KoiBinary } from "./../../libs/web-components-lib/data_element.js";

export class DemoUserData extends KoiData {

	constructProperties(){
		this._properties = {
			id: new KoiDataElementInteger({
				localized_name: 'id',
				default_value: null,
				allow_empty: true
			}),
			token: new KoiDataElementString({
				localized_name: 'token',
				default_value: null,
				allow_empty: true
			}),
			name: new KoiDataElementString({
				localized_name: 'name',
				default_value: null,
				allow_empty: true
			}),
			preferred_language: new (KoiBinary(KoiDataElementString))({
				localized_name: 'preferred_language',
				default_value: 'english',
				primary_option: 'english',
				secondary_option: 'russian',
				allow_empty: true
			}),
			company_name: new KoiDataElementString({
				localized_name: 'company_name',
				default_value: null,
				allow_empty: true
			}),
			company_type: new KoiDataElementString({
				localized_name: 'company_type',
				default_value: null,
				allow_empty: true
			}),
			company_link: new KoiDataElementString({
				localized_name: 'company_link',
				default_value: null,
				allow_empty: true
			}),
			company_purpose: new KoiDataElementString({
				localized_name: 'company_purpose',
				default_value: null,
				allow_empty: true
			})
		};
	}

	getId(){
		return this._getValueOrDefaultValue('id');
	}

	getToken(){
		return this._getValueOrDefaultValue('token');
	}

	getName(){
		return this._getValueOrDefaultValue('name');
	}

	getLanguage(){
		return this._getValueOrDefaultValue('preferred_language');
	}

	switchLanguage(){
		const language = this._getValueOrDefaultValue('preferred_language');
		const new_language = (language == 'russian') ? 'english' : 'russian';
		this._properties['preferred_language'].setValue(new_language);
	}

	setValues(new_values){
		for(let key in this._properties){
			if(new_values.hasOwnProperty(key)){
				this._properties[key].setValue(new_values[key]);
			}
		}
	}

	getRawValuesAsDict(){
		let dict = {};
		for(let key in this._properties){
			dict[key] = this._properties[key].getRawValue();
		}
		return dict;
	}
}
