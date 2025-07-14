/**
 * @module KoiFormFieldTextarea
 * Displays an edit field in forms
 * 
 * The user can change the value of the edit field.
 * Fires the koi-form-field-change event, passing a key-value pair
 * 
 * @version 1.13.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { KoiFormFieldStringNativeInputSocket, KoiFormFieldString } from "./control_form_field_string.js";

export class KoiFormFieldTextareaSocket extends KoiFormFieldStringNativeInputSocket {

	_getTemplateForInput(){
		return '<textarea id="' + this.getID() + 
			'" class="form-control koi-form-field-textarea"></textarea>';
	}

}

export class KoiFormFieldTextarea extends KoiFormFieldString {

	static getTagName(){
		return 'koi-form-field-textarea';
	}

	_constructSocket(){
		return new KoiFormFieldTextareaSocket({
			holder: this,
			placeholder: this._getPlaceholderFromAttributes()
		});
	}

}
