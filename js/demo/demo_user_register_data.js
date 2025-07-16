import { KoiData } from "./../../libs/web-components-lib/data.js";
import { KoiDataElementString } from "./../../libs/web-components-lib/data_element.js";

export class DemoUserRegisterData extends KoiData {

	constructProperties(){
		this._properties = {
			token: new KoiDataElementString({
				localized_name: 'token',
				default_value: null,
				allow_empty: false
			})
		};
	}

	getToken(){
		return this._getValueOrDefaultValue('token');
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