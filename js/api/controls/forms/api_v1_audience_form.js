import { KoiForm, KoiFormSocket } from "../../../../libs/web-components-lib/controls/forms/control_form.js";

import { KoiFormFieldString } from "../../../../libs/web-components-lib/controls/forms/control_form_field_string.js";
if (customElements.get(KoiFormFieldString.getTagName()) === undefined) {
	customElements.define(KoiFormFieldString.getTagName(), KoiFormFieldString);
}

import { KoiFormFieldTextarea } from "../../../../libs/web-components-lib/controls/forms/control_form_field_textarea.js";
if (customElements.get(KoiFormFieldTextarea.getTagName()) === undefined) {
	customElements.define(KoiFormFieldTextarea.getTagName(), KoiFormFieldTextarea);
}

export class ApiV1AudienceFormSocket extends KoiFormSocket {

	_getFormFieldTagString({ element_id, field_name, placeholder, element_class }) {
		if(field_name == 'description'){
			return KoiFormFieldTextarea.getTag({ element_id, field_name, placeholder, element_class });
		}
		return KoiFormFieldString.getTag({ element_id, field_name, placeholder, element_class });
	}

}

export class ApiV1AudienceForm extends KoiForm {

	// TODO - сделать для description textarea

	static getTagName(){
		return 'api-v1-audience-form';
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
			['apikey', 'description']
		);
	}

	_updateProvider(event_detail){
		this._connector._item.attemptSaveAPI(
			this._connector._item.data.getRawValuesAsDict()
		);
	}

	_attemptApplyConnectorDataChanged(event){
		super._attemptApplyConnectorDataChanged(event);
	}

	_constructSocket(){
		return new ApiV1AudienceFormSocket({
			holder: this
		});
	}

}
