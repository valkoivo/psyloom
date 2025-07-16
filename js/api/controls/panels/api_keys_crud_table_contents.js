/**
 * @module APIKeysCRUDTableContents
 * 
 * A composite component for the CRUD panel, designed to display a list 
 * of records as table rows. It connects to a data provider that 
 * supplies the records for display. When the provider's data changes, 
 * the component clears the existing rows and generates a new set. 
 * Each row consists of a provider containing the data for that 
 * specific row and a component that renders the row visually.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { CRUDSampleTableContents, CRUDSampleTableContentsSocket } from "../../../../js/crud/controls/panels/crud_sample_table_contents.js";

import { APIKeysCRUDItemProvider } from "../../../../js/api/providers/api_keys_crud_item_provider.js";
if (customElements.get(APIKeysCRUDItemProvider.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDItemProvider.getTagName(), APIKeysCRUDItemProvider);
}
import { APIKeysCRUDTableRowContents } from "./api_keys_crud_table_row_contents.js";
if (customElements.get(APIKeysCRUDTableRowContents.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDTableRowContents.getTagName(), APIKeysCRUDTableRowContents);
}

class APIKeysCRUDTableContentsSocket extends CRUDSampleTableContentsSocket {

	expandSocketWithArray(body_data){
		for(let row_i = 0; row_i < body_data.length; row_i++){
			this.expandSocket({
				item_id: body_data[row_i]['id'],
				item_name: body_data[row_i]['name'],
				apikey: body_data[row_i]['apikey'],
				user_id: body_data[row_i]['user_id'],
				deleted_at: body_data[row_i]['deleted_at']
			});
		}
	}

	_getTagForNewComponent({
		element_id,
		id,
		item_id,
		name,
		item_name,
		apikey,
		user_id,
		deleted_at
	}){
		let provider_id = element_id + '_provider';
		let contents_id = element_id + '_contents';
		return '<div class="d-block" id="' + element_id + '">' +
			APIKeysCRUDItemProvider.getTag({
				element_id: provider_id,
				item_id: item_id || id,
				apikey,
				user_id,
				item_name: item_name || name,
				deleted_at,
				element_class: 'd-none',
				load_url: 'apikeys/apikey/' + item_id,
				save_url: 'apikeys/apikey/' + item_id,
				user_connector: this._user_connector_id
			}) + 
			APIKeysCRUDTableRowContents.getTag({
				element_id: contents_id,
				provider_id: provider_id,
				element_class: ''
			}) +
		'</div>';
	}

	_insertComponentToDOM(component_params){
		super._insertComponentToDOM(component_params);
	}

	constructor({holder, user_connector_id}){
		super({holder});
		this._user_connector_id = user_connector_id;
	}

}

export class APIKeysCRUDTableContents extends CRUDSampleTableContents {

	static getTagName(){
		return 'api-keys-crud-table-contents';
	}

	static getTag({element_id, provider_id, element_class, user_connector, debug_mode}){
		let tag_name = this.getTagName();
		let str_element_class = (element_class != undefined) ? 'class="' + element_class + '"' : 'class="mb-3 d-block"';
		let str_debug_mode = debug_mode ? 'debug_mode="true"' : '';
		return '<' + tag_name + ' id="' + element_id + 
			'" provider_id="' + provider_id + 
			'" user_connector="' + user_connector + 
			'" ' + str_element_class + 
			' ' + str_debug_mode + 
			'></' + tag_name + '>';
	}

	_constructSocket(){
		return new APIKeysCRUDTableContentsSocket({
			holder: this,
			user_connector_id: this.getAttribute('user_connector')
		});
	}

}
