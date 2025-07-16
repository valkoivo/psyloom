import { KoiForm } from "../../../../libs/web-components-lib/controls/forms/control_form.js";

export class ApiV1AudienceProcessIdForm extends KoiForm {

	static getTagName(){
		return 'api-v1-audience-process-id-form';
	}

	static getTag({ element_id, provider_id, debug_mode }) {
		let tag_name = this.getTagName();
		let str_id = element_id ? ` id="${element_id}"` : '';
		let str_provider_id = provider_id ? ` provider_id="${provider_id}"` : '';
		let str_debug_mode = debug_mode ? ' debug_mode="true"' : '';
		return `<${tag_name}${str_id}${str_provider_id}${str_debug_mode}></${tag_name}>`;
	}

}
