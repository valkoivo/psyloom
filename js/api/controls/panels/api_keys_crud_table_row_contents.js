/**
 * @module CRUDSampleTableRowContents
 * A panel that represents a record as a table row within the CRUD panel. 
 * The table row displays the state of a single record's provider. It 
 * includes the record's data and a record management panel component. 
 * The row processes commands from the record management panel and 
 * forwards them to the single record's provider.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { CRUDSampleTableRowContentsSocket, CRUDSampleTableRowContents } from "../../../crud/controls/panels/crud_sample_table_row_contents.js";

import { APIKeysCRUDTableControlPanel } from "../../../api/controls/panels/api_keys_crud_table_row_control_panel.js";
if (customElements.get(APIKeysCRUDTableControlPanel.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDTableControlPanel.getTagName(), APIKeysCRUDTableControlPanel);
}

export class APIKeysCRUDTableRowContentsSocket extends CRUDSampleTableRowContentsSocket {

	getTemplate(){
		return '<div id="' + this.getID('row') + '" class="crud-table-row">' +
			/* '<div id="' + this.getID('item_id') + '" class="crud-table-cell">id</div>' + */
			'<div id="' + this.getID('item_name') + '" class="crud-table-cell">name</div>' +
			/* '<div id="' + this.getID('deleted') + '" class="crud-table-cell">del</div>' + */
			'<div id="' + this.getID('controls') + '" class="crud-table-cell">' +
				APIKeysCRUDTableControlPanel.getTag({
					element_id: this._holder.id + '_control_panel',
					provider_id: this._holder._getProviderId()
				}) +
			'</div>' +
		'</div>' +
		'<div id="' + this.getID('loading') + '" class="crud-table-row d-none">' +
			'<div class="crud-table-cell">' +
				'Loading...' +
			'</div>' +
		'</div>' +
		'<div id="' + this.getID('error') + '" class="crud-table-row d-none">' +
			'<div class="crud-table-cell">' +
				'Error...' +
			'</div>' +
		'</div>';
	}

	displayItemProperties({id, name, deleted_at}){
		// this._setInnerHTML('item_id', id);
		this._setInnerHTML('item_name', name);
		// this._setInnerHTML('deleted', deleted_at);
		if(deleted_at){
			this._holder.hide();
		}
	}

}

export class APIKeysCRUDTableRowContents extends CRUDSampleTableRowContents {

	static getTagName(){
		return 'api-keys-crud-table-row-contents';
	}

	_constructSocket(){
		return new APIKeysCRUDTableRowContentsSocket({
			holder: this
		});
	}

	_attemptApplyConnectorDataChanged(event){
		super._attemptApplyConnectorDataChanged(event);
	}

	_updateStateCodeWhenConnectorDataChanged(event_detail){
		super._updateStateCodeWhenConnectorDataChanged(event_detail);
		this._state.setChanged();
	}

	_updateSocket(){
		super._updateSocket();
	}

}
