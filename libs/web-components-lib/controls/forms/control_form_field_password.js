/**
 * @module KoiFormFieldPassword
 * Displays an edit field in forms
 * 
 * The user can change the value of the edit field.
 * Fires the koi-form-field-change event, passing a key-value pair
 * 
 * @version 1.13.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { KoiFormFieldString, KoiFormFieldStringNativeInputSocket } from "./control_form_field_string.js";

export class KoiFormFieldPasswordNativeInputSocket extends KoiFormFieldStringNativeInputSocket {

	_getTemplateForInput(){
		return '<input id="' + this.getID() +
			'" value="" placeholder="' + this._placeholder +
			'" class="form-control" type="password">';
	}

}

export class KoiFormFieldPassword extends KoiFormFieldString {

	static getTagName(){
		return 'koi-form-field-password';
	}

	_constructSocket(){
		return new KoiFormFieldPasswordNativeInputSocket({
			holder: this,
			placeholder: this._getPlaceholderFromAttributes()
		});
	}

}
