/**
 * @module APIKeysCRUDTableControlPanel
 * A simple control panel for the CRUD panel, designed to provide 
 * the user with tools to manage records. It contains an action 
 * selection dialog, a dialog that allows the user to issue a command 
 * to delete a record, and a dialog that allows the user to issue 
 * a command to change the record's name. These two commands are 
 * passed through the control panel. Other commands, intended for 
 * switching between dialog components, are executed by the panel 
 * itself, which manages the visibility of the dialogs.
 * 
 * Since one of the dialogs needs to know the provider's identifier 
 * in order to display the initial record name, the panel has 
 * a provider_id attribute and passes its value to the dialog.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { CRUDSampleControlPanel, CRUDSampleControlPanelSocket } from "../../../crud/controls/panels/crud_sample_control_panel.js";

import { APIKeysCRUDTableItemActionsDialog } from "../dialogs/api_keys_crud_table_item_actions_dialog.js";
if (customElements.get(APIKeysCRUDTableItemActionsDialog.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDTableItemActionsDialog.getTagName(), APIKeysCRUDTableItemActionsDialog);
}
import { APIKeysCRUDTableItemDeleteDialog } from "../dialogs/api_keys_crud_table_item_delete_dialog.js";
if (customElements.get(APIKeysCRUDTableItemDeleteDialog.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDTableItemDeleteDialog.getTagName(), APIKeysCRUDTableItemDeleteDialog);
}
import { APIKeysCRUDTableItemEditDialog } from "../dialogs/api_keys_crud_table_item_edit_dialog.js";
if (customElements.get(APIKeysCRUDTableItemEditDialog.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDTableItemEditDialog.getTagName(), APIKeysCRUDTableItemEditDialog);
}

export class APIKeysCRUDTableControlPanelSocket extends CRUDSampleControlPanelSocket {

	getTemplate(){
		return APIKeysCRUDTableItemActionsDialog.getTag({
			element_id: this.getID('buttons'),
			message: '',
			apply_caption: 'Edit',
			cancel_caption: 'Delete',
			element_class: ''
		}) +
		APIKeysCRUDTableItemDeleteDialog.getTag({
			element_id: this.getID('delete_dialog'),
			message: 'Do you want to delete this record?',
			apply_caption: 'Yes',
			cancel_caption: 'No',
			element_class: 'd-none'
		}) +
		APIKeysCRUDTableItemEditDialog.getTag({
			element_id: this.getID('edit_dialog'),
			provider_id: this._provider_id,
			message: 'Enter new name:',
			apply_caption: 'Apply',
			cancel_caption: 'Cancel',
			element_class: 'd-none'
		});
	}

}

export class APIKeysCRUDTableControlPanel extends CRUDSampleControlPanel {

	static getTagName(){
		return 'api-keys-crud-table-control-panel';
	}

	_constructSocket(){
		return new APIKeysCRUDTableControlPanelSocket({
			holder: this,
			provider_id: this.getAttribute('provider_id')
		});
	}

}
