/**
 * @module ApiKeysCRUDHeaderedFrame
 * A component that wraps the CRUD panel. It is designed to display 
 * records obtained from the provider and provide tools for managing 
 * the list of records. It can be split into several components, 
 * but for simplicity, it combines the functions.
 * 
 * The first function is to display the list of records. To achieve 
 * this, the component contains a record list component connected 
 * to the list provider. Additionally, the wrapping component displays 
 * the state of the list provider.
 * 
 * The second function is to display the table header.
 * 
 * The third function is to provide a tool for adding records. 
 * To do this, the component includes an adding provider and 
 * an addition panel. When receiving a user command to add a record, 
 * the component passes this command to the adding provider. 
 * When the data of the adding provider changes, the wrapping component 
 * passes the new record data to the list component.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
 */

import { KoiCompositeSocket, KoiSocketTemplateCapable } from "../../../../libs/web-components-lib/socket.js";
import { KoiPanel } from "../../../../libs/web-components-lib/controls/panels/control_panel.js";
import { KoiSocketConnectable, KoiControlConnectorInteractable } from "../../../../libs/web-components-lib/controls/control.js";
import { CRUDDataElementListOfNames } from "../../../crud/crud_data_element.js";
import { CRUDSampleAppendItemDialog } from "../../../../js/crud/controls/dialogs/crud_sample_append_item_dialog.js";
import { KoiOperationsInterceptable } from "../../../../libs/web-components-lib/event_operated.js";
import { KoiPaginator } from "../../../../libs/web-components-lib/controls/paginators/control_paginator.js";

import { APIKeysCRUDTableContents } from "../../../../js/api/controls/panels/api_keys_crud_table_contents.js";
if (customElements.get(APIKeysCRUDTableContents.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDTableContents.getTagName(), APIKeysCRUDTableContents);
}

import { APIKeysCRUDAppendPanel } from "../../../../js/api/controls/panels/api_keys_crud_append_panel.js";
if (customElements.get(APIKeysCRUDAppendPanel.getTagName()) === undefined) {
	customElements.define(APIKeysCRUDAppendPanel.getTagName(), APIKeysCRUDAppendPanel);
}

export class ApiKeysCRUDHeaderedFrameSocket extends KoiSocketTemplateCapable(KoiCompositeSocket) {

	displayWaiting(){
		this._hide('holder');
		this._hide('error');
		this._show('spinner');
		this._holder.show();
	}

	displayError(){
		this._hide('holder');
		this._show('error');
		this._hide('spinner');
		this._holder.show();
	}

	displayNormalState(){
		this._show('holder');
		this._hide('error');
		this._hide('spinner');
		this._holder.show();
	}

	_getHeaderTemplate(){
		let head_data = CRUDDataElementListOfNames.getHeader();
		return '<div class="crud-table-header">' +
			/* '<div class="crud-table-cell">' + head_data[0] + '</div>' + */
			'<div class="crud-table-cell">' + head_data[1] + '</div>' +
			/* '<div class="crud-table-cell">' + head_data[2] + '</div>' + */
			'<div class="crud-table-cell">&nbsp;</div>' +
		'</div>';
	}

	getTemplate(){
		return '<div id="' + this.getID('holder') + '" class="d-none">' +
			APIKeysCRUDAppendPanel.getTag({
				element_id: this.getID('append_panel'),
				user_connector: this._user_connector_id,
				element_class: 'card api-keys-crud-append-panel mb-3'
			}) +
			'<div class="api-keys-crud-table card mb-3" style="">' +
				'<div id="' + this.getID('head') + '" class="card-header">' +
					this._getHeaderTemplate() +
				'</div>' +
				'<div class="card-body">' +
					// TODO - Подрезать ключи
					// TODO - Перевод на русский
					APIKeysCRUDTableContents.getTag({
						element_id: this.getID('body'), 
						provider_id: this._provider_id, 
						element_class: 'api-keys-crud-table-body mb-0',
						debug_mode: false,
						user_connector: this._user_connector_id
					}) +
					KoiPaginator.getTag({
						element_id: this._holder.id + '_payments_list',
						provider_id: this._provider_id,
						element_class: 'd-block mt-3'
					}) +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div id="' + this.getID('spinner') + '" class="card mb-3" style="padding: 14px;">' +
			'<div class="alert alert-primary" role="alert">Loading...</div>' +
		'</div>' +
		'<div id="' + this.getID('error') + '" class="card mb-3 d-none" style="padding: 14px;">' +
			'<div class="alert alert-danger" role="alert">Error</div>' +
		'</div>';
	}

	attemptAppendItem(item_name){
		this._items['append_panel'].attemptAppendItem(item_name);
	}

	appendItem(item_properties){
		this._items['body'].attemptExpandSocket(item_properties);
		this._items['append_panel'].displayKeyAppendedMessage(item_properties);
	}

	_getEmptySchemaIds(){
		return {
			holder: this._holder.id + '_holder',
			append_panel: this._holder.id + '_append_panel',
			head: this._holder.id + '_head',
			body: this._holder.id + '_body',
			spinner: this._holder.id + '_spinner',
			error: this._holder.id + '_error'
		};
	}

	constructor({holder, provider_id, user_connector_id}){
		super({holder});
		this._provider_id = provider_id;
		this._user_connector_id = user_connector_id;
	}

}

export const ApiKeysCRUDHeaderedFrameSocketConnectable = Sup => class extends KoiSocketConnectable(Sup) {

	_displayWaiting(){
		super._displayWaiting();
		this.socket.displayWaiting();
	}

	_displayError(){
		super._displayError();
		this.socket.displayError();
	}

	_updateSocket(){
		super._updateSocket();
		this.socket.displayNormalState();
	}

	_attemptAppendItem(item_name){
		this.socket.attemptAppendItem(item_name);
	}

	_appendItem(item_properties){
		this.socket.appendItem(item_properties);
	}

	_constructSocket(){
		return new ApiKeysCRUDHeaderedFrameSocket({
			holder: this,
			provider_id: this._getProviderId(),
			user_connector_id: this.getAttribute('user_connector')
		});
	}

}

export class ApiKeysCRUDHeaderedFrame extends KoiControlConnectorInteractable(
	ApiKeysCRUDHeaderedFrameSocketConnectable(
		KoiOperationsInterceptable(
			KoiPanel
		)
	)
) {

	static getTagName(){
		return 'api-keys-crud-headered-frame';
	}

	static getTag({element_id, provider_id, user_connector, element_class, debug_mode}){
		let tag_name = this.getTagName();
		let str_element_class = (element_class != undefined) ? 'class="' + element_class + '"' : 'class="mb-3 d-block"';
		let str_user_connector = user_connector ? ` user_connector="${user_connector}"` : '';
		let str_debug_mode = debug_mode ? 'debug_mode="true"' : '';
		return '<' + tag_name + ' id="' + element_id + 
			'" provider_id="' + provider_id + 
			'" ' + str_element_class + 
			' ' + str_user_connector +
			' ' + str_debug_mode +
			'></' + tag_name + '>';
	}

	_getInterceptableOperateEventCode(){
		return ['koi-operated', 'koi-changed'];
	}

	_handleOperated(event_detail){
		if(event_detail.element_id == this.socket._items.append_panel.socket.getID('append_provider')){
			if(event_detail.state.isReady() && event_detail.data.getChangedAny()){
				this._appendItem(
					event_detail.data.getItemProperties()
				);
			}
		}else if(this._getItemActionFromOperationData(event_detail.data) == CRUDSampleAppendItemDialog.getApplyActionCode()){
			this._attemptAppendItem(
				this._getItemValueFromOperationData(event_detail.data)
			);
		}
	}

	_onConstructed(){
		super._onConstructed();
		this._user_connector = this.getAttribute('user_connector');
	}

}
