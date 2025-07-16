import { KoiForm, KoiFormSocket } from "../../../../libs/web-components-lib/controls/forms/control_form.js";

import { KoiFormFieldString } from "../../../../libs/web-components-lib/controls/forms/control_form_field_string.js";
if (customElements.get(KoiFormFieldString.getTagName()) === undefined) {
	customElements.define(KoiFormFieldString.getTagName(), KoiFormFieldString);
}

import { KoiFormFieldTextarea } from "../../../../libs/web-components-lib/controls/forms/control_form_field_textarea.js";
if (customElements.get(KoiFormFieldTextarea.getTagName()) === undefined) {
	customElements.define(KoiFormFieldTextarea.getTagName(), KoiFormFieldTextarea);
}

import { KoiFormFieldSingleChoice } from "../../../../libs/web-components-lib/controls/forms/control_form_field_single_choice.js";
if (customElements.get(KoiFormFieldSingleChoice.getTagName()) === undefined) {
	customElements.define(KoiFormFieldSingleChoice.getTagName(), KoiFormFieldSingleChoice);
}

export class ApiV1QueryFormSocket extends KoiFormSocket {

	_getFormFieldTagString({ element_id, field_name, placeholder, element_class }) {
		if(field_name == 'context'){
			return KoiFormFieldTextarea.getTag({ element_id, field_name, placeholder, element_class });
		}else if(field_name == 'prompt'){
			return KoiFormFieldTextarea.getTag({ element_id, field_name, placeholder, element_class });
		}else if(field_name == 'mode'){
			return KoiFormFieldSingleChoice.getTag({
				element_id,
				field_name,
				field_value: 'dialogue',
				options: ['dialogue', 'emotion', 'reaction', 'interpretation', 'action'],
				placeholder,
				element_class
			});
		}else if(field_name == 'perspective'){
			return KoiFormFieldSingleChoice.getTag({
				element_id,
				field_name,
				field_value: 'first_person',
				options: ['first_person', 'third_person', 'other'],
				placeholder,
				element_class
			});
		}
		return KoiFormFieldString.getTag({ element_id, field_name, placeholder, element_class });
	}

}

export class ApiV1QueryForm extends KoiForm {

	static getTagName(){
		return 'api-v1-query-form';
	}

	static getTag({ element_id, provider_id, debug_mode }) {
		let tag_name = this.getTagName();
		let str_id = element_id ? ` id="${element_id}"` : '';
		let str_provider_id = provider_id ? ` provider_id="${provider_id}"` : '';
		let str_debug_mode = debug_mode ? ' debug_mode="true"' : '';
		return `<${tag_name}${str_id}${str_provider_id}${str_debug_mode}></${tag_name}>`;
	}

	_activateForm(){
		this.socket.activateForm(
			this._connector._item.data,
			['apikey', 'person_id', 'context', 'prompt', 'mode', 'perspective']
		);
	}

	_updateProvider(event_detail){
		this._connector._item.attemptSaveAPI(
			this._connector._item.data.getValuesAsDict()
		);
	}

	_attemptApplyConnectorDataChanged(event){
		super._attemptApplyConnectorDataChanged(event);
	}

	_constructSocket(){
		return new ApiV1QueryFormSocket({
			holder: this
		});
	}

}
