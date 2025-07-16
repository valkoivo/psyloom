import { APIV1QueryProvider } from "../../api/providers/api_v1_query_provider.js";

export class DemoAPIV1QueryProvider extends APIV1QueryProvider {

	static getTagName(){
		return 'demo-api-v1-query-provider';
	}

	static getTag({
		element_id,
		save_url,
		debug_mode,
		user_connector
	}){
		let tag_name = this.getTagName();
		let str_debug_mode = debug_mode ? 'debug_mode="true"' : '';
		return '<' + tag_name + 
			' id="' + element_id + 
			'" save_url="' + save_url + 
			'" ' + str_debug_mode +
			' user_connector="' + user_connector + 
			'"></' + tag_name + '>';
	}

	getQuerySaveParams(new_values){
		return this._getQuerySaveParams({
			method: 'POST',
			new_values,
			token: this._user_connector.data.getToken()
		});
	}

	_onConstructed(){
		super._onConstructed();
		this._user_connector_id = this.getAttribute('user_connector');
		this._user_connector = document.getElementById(this._user_connector_id);
	}

}
