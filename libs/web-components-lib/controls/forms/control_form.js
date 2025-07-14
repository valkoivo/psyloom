/**
 * @module KoiForm
 * 
 * id - required
 * connector - a provider that has attemptSaveAPI(data) method
*/

import { KoiControlConnectorInteractable, KoiSocketConnectable, KoiBaseControl } from "../control.js";
import { KoiCompositeSocket, KoiSocketTemplateCapable } from "../../socket.js";
import { KoiOperationsInterceptable } from "../../event_operated.js";
import { KoiFormFieldChangesInterceptable } from "./event_form_field_change.js";

import { KoiFormFieldString } from "./control_form_field_string.js";
if (customElements.get(KoiFormFieldString.getTagName()) === undefined) {
	customElements.define(KoiFormFieldString.getTagName(), KoiFormFieldString);
}
import { KoiFormFieldPassword } from "./control_form_field_password.js";
if (customElements.get(KoiFormFieldPassword.getTagName()) === undefined) {
	customElements.define(KoiFormFieldPassword.getTagName(), KoiFormFieldPassword);
}
import { KoiFormFieldInteger, KoiFormFieldFloat } from "./control_form_field_integer.js";
if (customElements.get(KoiFormFieldInteger.getTagName()) === undefined) {
	customElements.define(KoiFormFieldInteger.getTagName(), KoiFormFieldInteger);
}
if (customElements.get(KoiFormFieldFloat.getTagName()) === undefined) {
	customElements.define(KoiFormFieldFloat.getTagName(), KoiFormFieldFloat);
}
import { KoiFormFieldDate } from "./control_form_field_date.js";
if (customElements.get(KoiFormFieldDate.getTagName()) === undefined) {
	customElements.define(KoiFormFieldDate.getTagName(), KoiFormFieldDate);
}
import { KoiFormFieldBinary } from "./control_form_field_binary.js";
if (customElements.get(KoiFormFieldBinary.getTagName()) === undefined) {
	customElements.define(KoiFormFieldBinary.getTagName(), KoiFormFieldBinary);
}
import { KoiFormFieldSingleChoice } from "./control_form_field_single_choice.js";
if (customElements.get(KoiFormFieldSingleChoice.getTagName()) === undefined) {
	customElements.define(KoiFormFieldSingleChoice.getTagName(), KoiFormFieldSingleChoice);
}
import { KoiFormFieldCheckBoxes } from "./control_form_field_check_boxes.js";
if (customElements.get(KoiFormFieldCheckBoxes.getTagName()) === undefined) {
	customElements.define(KoiFormFieldCheckBoxes.getTagName(), KoiFormFieldCheckBoxes);
}

import { KoiIdButton } from "../buttons/control_idbutton.js";
if (customElements.get(KoiIdButton.getTagName()) === undefined) {
	customElements.define(KoiIdButton.getTagName(), KoiIdButton);
}
import { KoiLabel } from "../labels/control_label.js";
if (customElements.get(KoiLabel.getTagName()) === undefined) {
	customElements.define(KoiLabel.getTagName(), KoiLabel);
}

export class KoiFormSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds(){
		let ids = {
			formpanel: this._holder.id + '_formpanel',
			fieldset: this._holder.id + '_fieldset',
			successpanel: this._holder.id + '_successpanel',
			btn: this._holder.id + '_btn',
			errorlabel: this._holder.id + '_errorlabel'
		};
		return ids;
	}

	_getFormFieldTagString({ element_id, field_name, placeholder, element_class }) {
		return KoiFormFieldString.getTag({ element_id, field_name, placeholder, element_class });
	}

	_getFormFieldTag(key, property) {
		const element_id = this._getFieldId(key);
		const field_name = key;
		const placeholder = property.getLocalizedName() || key;
		const element_class = 'mb-3 d-block';

		const type = property.getType();

		const form_field_properties = {
			element_id,
			field_name,
			placeholder,
			element_class
		};

		if (key.includes('password')) {
			return KoiFormFieldPassword.getTag({ element_id, field_name, placeholder, element_class });
		}

		switch(type) {
			case 'integer':
				return KoiFormFieldInteger.getTag({ element_id, field_name, placeholder, element_class });
			case 'float':
				return KoiFormFieldFloat.getTag({ element_id, field_name, placeholder, element_class });
			case 'date':
				return KoiFormFieldDate.getTag({ element_id, field_name, placeholder, element_class });
			case 'binary':
				return KoiFormFieldBinary.getTag({ element_id, field_name, placeholder, element_class });
			case 'optionable_string':
				return KoiFormFieldSingleChoice.getTag({ element_id, field_name, placeholder, element_class, options: property.getOptions() });
			case 'categorical_list':
				return KoiFormFieldCheckBoxes.getTag({ element_id, field_name, placeholder, element_class, options: property.getOptions() });
			case 'string':
			default:
				return this._getFormFieldTagString(form_field_properties);
		}
	}

	_getFieldsetTemplate(data, fields){
		let fields_template = '';
		for(const i in fields){
			const key = fields[i];
			const property = data._properties[key];
			fields_template += this._getFormFieldTag(key, property);
		}
		return fields_template;
	}

	getTemplate(){
		return '<div id="' + this.getID('formpanel') + '">' +
			'<form onsubmit="event.preventDefault();">' +
				KoiLabel.getTag({
					element_id: this.getID('errorlabel'),
					value: ''
				}) +
				'<fieldset id="' + this.getID('fieldset') + '">' +
				'</fieldset>' +
				KoiIdButton.getTag({
					element_id: this.getID('btn'),
					item_action: 'Submit',
					btn_type: 'submit',
					placeholder: this.getSubmitButtonCaption(),
					btn_enabled: true
				}) +
			'</form>' +
		'</div>' +
		'<div id="' + this.getID('successpanel') + '" class="card mt-3 p-3 d-none">' +
			this.getSuccessMessage() +
		'</div>';
	}

	_enable(key){
		if (this._items[key] && typeof this._items[key].enable === 'function') {
			this._items[key].enable();
		} else if (this._items[key]) {
			this._items[key].removeAttribute('disabled');
		}
	}

	_disable(key){
		if (this._items[key] && typeof this._items[key].disable === 'function') {
			this._items[key].disable();
		} else if (this._items[key]) {
			this._items[key].setAttribute('disabled', 'disabled');
		}
	}

	_enableAllFields() {
		for(const key in Object.keys(this._fieldset)){
			this._enable(key);
		}
		this._enable('btn');
	}

	_disableAllFields() {
		for(const key in Object.keys(this._fieldset)){
			this._disable(key);
		}
		this._disable('btn');
	}

	_showHourglass(){
		this._items['btn'].showHourglass();
	}

	_hideHourglass(){
		this._items['btn'].hideHourglass();
	}

	_clearErrorLabel(){
		this._items['errorlabel'].hide();
		for(const key in Object.keys(this._fieldset)){
			if (this._items[key] && this._items[key].socket) {
				this._items[key].socket.removeError();
			}
		}
	}

	_showErrors(event_error){
		if(!event_error){
			return;
		}
		this._items['errorlabel'].hide();
		if(event_error.hasOwnProperty('errors')){
			if('form' in event_error['errors']){
				this._items['errorlabel'].show();
				this._items['errorlabel'].attemptChangeValue(event_error['errors']['form'].join(' '));
			}
			for(const key in event_error['errors']) {
				if (this._items[key] && this._items[key].socket) {
					this._items[key].socket.displayError(event_error['errors'][key].join(' '));
				}
			}
		}else if(event_error.hasOwnProperty('message')){
			this._items['errorlabel'].show();
			this._items['errorlabel'].attemptChangeValue(event_error['message']);
		}else if (typeof event_error === 'string') {
			this._items['errorlabel'].show();
			this._items['errorlabel'].attemptChangeValue(event_error);
		}
	}

	getSubmitButtonCaption() {
		return 'Submit';
	}

	getSuccessMessage() {
		return 'Success!';
	}

	_getFieldId(key){
		return this._holder.id + '_field_' + key;
	}

	_setupFieldSet(data, fields){
		for(const key in fields){
			const element_id = this._getFieldId(key);
			const link = document.getElementById(element_id);
			this._fieldset[key] = link;
			this._ids[key] = element_id;
			this._items[key] = link;
		}
	}

	activateForm(data, fields){

		this._items.fieldset.innerHTML = this._getFieldsetTemplate(data, fields);
		this._setupFieldSet(data, fields);

		this._show('formpanel');
		this._hide('successpanel');
		this._enableAllFields();
		this._hideHourglass();
		this._clearErrorLabel();
	}

	showResponse(response){
		if(!response){
			this._hide('successpanel');
			return;
		}
		this._show('successpanel');
		this._items.successpanel.innerHTML = '<p>Response:</p><pre style="white-space: pre-wrap;word-break: break-all;">' + JSON.stringify(JSON.parse(response), null, 2) + '</pre>';
	}

	displayLoading(){
		this._show('formpanel');
		this.showResponse();
		this._disableAllFields();
		this._showHourglass();
		this._clearErrorLabel();
	}

	displaySuccess(response){
		this._show('formpanel');
		this.showResponse(response);
		this._enableAllFields();
		this._hideHourglass();
		this._clearErrorLabel();
	}

	displayError(event_error){
		this._show('formpanel');
		this.showResponse(event_error);
		this._enableAllFields();
		this._hideHourglass();
		this._showErrors(event_error);
	}

	constructor({ holder }) {
		super({ holder });
		this._fieldset = [];
	}
}

export class KoiForm extends KoiFormFieldChangesInterceptable(
	KoiOperationsInterceptable(
		KoiSocketConnectable(
			KoiControlConnectorInteractable(
				KoiBaseControl
			)
		)
	)
) {

	static getTagName(){
		return 'koi-form';
	}

	_displayWaiting(){
		super._displayWaiting();
		this.socket.displayLoading();
	}

	_displayBadConnection(){
		super._displayBadConnection();
		this.socket.displayError(
			this._connector._item.data.getResponse()
		);
	}

	_displayError(){
		super._displayError();
		this.socket.displayError(
			this._connector._item.data.getResponse()
		);
	}

	_displayForbidden(){
		super._displayForbidden();
		this.socket.displayError(
			this._connector._item.data.getResponse()
		);
	}

	_updateSocket(){
		super._updateSocket();
		this.socket.displaySuccess(
			this._connector._item.data.getResponse()
		);
	}

	_activateForm(){
		this.socket.activateForm(
			this._connector._item.data,
			['apikey', 'process_id']
		);
	}

	_beforeDisplayNormalState() {
		super._beforeDisplayNormalState();
		this._activateForm();
	}

	_constructSocket(){
		return new KoiFormSocket({
			holder: this
		});
	}

	_updateOwnDataWhenSocketChanged(event_detail){
		const field_name = this._getFormFieldNameFromEvent(event_detail);
		const field_value = this._getFormFieldValueFromEvent(event_detail);
		if (this._connector._item.data._properties.hasOwnProperty(field_name)) {
			this._connector._item.data._properties[field_name].setValue(field_value);
			this._connector._item._state.setChanged();
		}
	}

	_updateProvider(event_detail){
		this._connector._item.attemptLoadAPI({});
	}

	_updateSomethingWhenOperated(event_detail){
		super._updateSomethingWhenOperated(event_detail);
		this._updateProvider(event_detail);
	}

}
