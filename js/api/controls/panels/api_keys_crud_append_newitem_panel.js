/**
 * @module APIKeysCRUDAppendNewItemPanel
 * A simple component for the CRUD panel, designed to provide 
 * the user with a tool for adding a new record. It contains 
 * a dialog component that allows the user to issue a command 
 * to add a record. To prevent the user from using the dialog 
 * component when the record-adding provider is busy, 
 * the component adjusts its display based on the provider's 
 * state, hiding the dialog component.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { CRUDSampleAppendPanelSocket, CRUDSampleAppendPanel } from "../../../../js/crud/controls/panels/crud_sample_append_panel.js";

import { APIKeysCRUDAppendNewItemDialog } from "../dialogs/api_keys_crud_append_newitem_dialog.js";
if (customElements.get(APIKeysCRUDAppendNewItemDialog.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDAppendNewItemDialog.getTagName(), APIKeysCRUDAppendNewItemDialog);
}

export class APIKeysCRUDAppendNewItemPanelSocket extends CRUDSampleAppendPanelSocket {

	getTemplate(){
		return '<h3 id="' + this.getID('dialog_header') + '">Create new API key</h3>' +
		'<div class="d-none" id="' + this.getID('dialog_holder') + '">' +
			APIKeysCRUDAppendNewItemDialog.getTag({
				element_id: this.getID('dialog'),
				message: 'Append an Item',
				apply_caption: 'Append',
				cancel_caption: 'Cancel',
				element_class: ''
			}) +
		'</div>' +
		'<div class="alert alert-primary mb-0" role="alert" id="' + this.getID('spinner') + '">Loading...</div>' +
		'<div class="alert alert-danger d-none mb-0" role="alert" id="' + this.getID('error') + '">Error</div>';
	}

	_getEmptySchemaIds(){
		return {
			dialog_holder: this._holder.id + '_dialog_holder',
			dialog_header: this._holder.id + '_dialog_header',
			dialog: this._holder.id + '_dialog',
			spinner: this._holder.id + '_spinner',
			error: this._holder.id + '_error'
		};
	}

	_getLocalizedText(language, key) {
		const dictionary = {
			dialog_header: {
				english: 'Create new API key',
				russian: 'Создать ключ API'
			}
		};
		return (dictionary[key] && dictionary[key][language]) ? dictionary[key][language] : dictionary[key]['english'];
	}

	changeLanguage(language){
		if (this._items.dialog_header) {
			this._items.dialog_header.innerHTML = this._getLocalizedText(language, 'dialog_header');
		}
		if (this._items.dialog) {
			this._items.dialog.changeLanguage(language);
		}
	}

}

export class APIKeysCRUDAppendNewItemPanel extends CRUDSampleAppendPanel {

	static getTagName(){
		return 'api-keys-crud-append-newitem-panel';
	}

	_constructSocket(){
		return new APIKeysCRUDAppendNewItemPanelSocket({
			holder: this
		});
	}

	_isLanguageChanged() {
		return this._connector._item._language_changed;
	}

	_changeSocketLanguage(){
		if(!this._isLanguageChanged()){
			return;
		}
		this.socket.changeLanguage(this._connector._item._getLanguage());
	}

	_updateStateCodeWhenConnectorDataChanged(event_detail){
		super._updateStateCodeWhenConnectorDataChanged(event_detail);
		this._changeSocketLanguage();
	}

}
