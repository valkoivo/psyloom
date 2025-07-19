/**
 * @module DemoChatPanel
 * Панель для демонстрации чат-бота.
 * 
 */

import { KoiSocketConnectable, KoiBaseControl } from "../../../../libs/web-components-lib/controls/control.js";
import { KoiCompositeSocket, KoiSocketTemplateCapable } from "../../../../libs/web-components-lib/socket.js";
import { KoiOperationsInterceptable } from "../../../../libs/web-components-lib/event_operated.js";
import { KoiFormFieldChangesInterceptable } from "../../../../libs/web-components-lib/controls/forms/event_form_field_change.js";

import { KoiIdButton } from "../../../../libs/web-components-lib/controls/buttons/control_idbutton.js";
if (customElements.get(KoiIdButton.getTagName()) === undefined) {
	customElements.define(KoiIdButton.getTagName(), KoiIdButton);
}
import { KoiFormFieldTextarea } from "../../../../libs/web-components-lib/controls/forms/control_form_field_textarea.js";
if (customElements.get(KoiFormFieldTextarea.getTagName()) === undefined) {
	customElements.define(KoiFormFieldTextarea.getTagName(), KoiFormFieldTextarea);
}
import { KoiFormFieldSingleChoice } from "../../../../libs/web-components-lib/controls/forms/control_form_field_single_choice.js";
if (customElements.get(KoiFormFieldSingleChoice.getTagName()) === undefined) {
	customElements.define(KoiFormFieldSingleChoice.getTagName(), KoiFormFieldSingleChoice);
}
import { DemoGameBackButton } from "../buttons/demo_game_back_button.js";
if (customElements.get(DemoGameBackButton.getTagName()) === undefined) {
	customElements.define(DemoGameBackButton.getTagName(), DemoGameBackButton);
}
import { DemoResponsePanel } from "./demo_response_panel.js";
if (customElements.get(DemoResponsePanel.getTagName()) === undefined) {
	customElements.define(DemoResponsePanel.getTagName(), DemoResponsePanel);
}

export class DemoChatPanelSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds() {
		return {
			context: this._holder.id + "_context",
			prompt: this._holder.id + "_prompt",
			perspective: this._holder.id + "_perspective",
			perspective_explanation: this._holder.id + "_perspective_explanation",
			mode: this._holder.id + "_mode",
			mode_explanation: this._holder.id + "_mode_explanation",
			request: this._holder.id + "_request",
			response: this._holder.id + "_response",
			send_request_btn: this._holder.id + '_send_request_btn'
		};
	}

	getTemplate() {
		return '<div class="step-header">' +
			DemoGameBackButton.getTag({
				element_id: this._holder.id + '_back_btn_6',
				item_action: 'step2',
				btn_enabled: true,
				placeholder: ''
			}) +
			'<h3>Step 3. Start Interacting</h3>' +
		'</div>' +
		'<p>Now that your digital persona is ready, you can begin interacting with them.</p>' +
		'<p>The first thing you need to do is describe the situation that will define the context of the interaction.</p>' +
		KoiFormFieldTextarea.getTag({
			element_id: this.getID('context'),
			field_name: 'context',
			field_value: '',
			placeholder: 'Context',
			element_class: 'd-block mb-3'
		}) +
		'<p>Based on the context, we want to receive a response in one of several formats</p>' +
		KoiFormFieldSingleChoice.getTag({
			element_id: this.getID('perspective'),
			field_name: 'perspective',
			field_value: 'first_person',
			options: ['first_person', 'third_person', 'other'],
			placeholder: 'Perspective',
			element_class: 'd-block mb-3'
		}) +
		'<p class="perspective_explanation" id="' + this.getID('perspective_explanation') + '"></p>' +
		'<p>Now let\'s specify what kind of insight you want to get from the persona</p>' +
		KoiFormFieldSingleChoice.getTag({
			element_id: this.getID('mode'),
			field_name: 'mode',
			field_value: 'dialogue',
			options: ['dialogue', 'emotion', 'reaction', 'interpretation', 'action'],
			placeholder: 'Mode',
			element_class: 'd-block mb-3'
		}) +
		'<p class="mode_explanation" id="' + this.getID('mode_explanation') + '"></p>' +
		'<p>And the last thing to do is write your prompt.</p>' +
		KoiFormFieldTextarea.getTag({
			element_id: this.getID('prompt'),
			field_name: 'prompt',
			field_value: '',
			placeholder: 'Prompt',
			element_class: 'd-block mb-3'
		}) +
		'<p>Here’s what the final request looks like.</p>' +
		'<div class="card">' +
			'<div class="card-body">' +
				'<div class="code-block">' +
					'<div><span class="key">POST</span> https://api.psyloom.com/api/v1/query</div>' +
					'<div><span class="bracket">{</span></div>' +
						'<div class="indent" id="' + this.getID('request') + '">' +
						'</div>' +
					'<div><span class="bracket">}</span></div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<p>Everything’s set — let’s send the request.</p>' +
		KoiIdButton.getTag({
			element_id: this.getID('send_request_btn'),
			item_action: 'send_request',
			btn_enabled: true,
			placeholder: 'Send it now!',
			css_class: 'd-block mb-3'
		}) +
		DemoResponsePanel.getTag({
			element_id: this.getID('response'),
			element_class: 'mt-3 mb-3 d-block d-none',
			provider_id: this._demo_provider_id,
			holder_id: this._holder.id
		});
		'<div id="' + this.getID('response') + '" class="d-none"></div>';
	}

	enable(){
		this._items['context'].enable();
		this._items['prompt'].enable();
		this._items['perspective'].enable();
		this._items['mode'].enable();
		this._items['send_request_btn'].enable();
		this._items['send_request_btn'].hideHourglass();
	}

	disable(){
		this._items['context'].disable();
		this._items['prompt'].disable();
		this._items['perspective'].disable();
		this._items['mode'].disable();
		this._items['send_request_btn'].disable();
		this._items['send_request_btn'].showHourglass();
	}

	updateRequest(data){
		let str = '<div>' +
			'<span class="key">"person_id"</span>: ' +
			'<span class="value-string">"mYjq3Cy3oqmz2FdAKB10/pfISuNss37p4pIWnPVVVTcvj8MLzWK9T+AQayIjQR4gHiSzFoER24xpynkMBaUKPmklQMoiXIthFAUKr0+mEFMzIFyY"</span>' +
		'</div>' +
		'<div>' +
			'<span class="key">"context"</span>: ' +
			'<span class="value-string">"' + data.getContext() + '"</span>' +
		'</div>' +
		'<div>' +
			'<span class="key">"perspective"</span>: ' +
			'<span class="value-string">"' + data.getPerspective() + '"</span>' +
		'</div>' +
		'<div>' +
			'<span class="key">"mode"</span>: ' +
			'<span class="value-string">"' + data.getMode() + '"</span>' +
		'</div>' +
		'<div>' +
			'<span class="key">"prompt"</span>: ' +
			'<span class="value-string">"' + data.getPrompt() + '"</span>' +
		'</div>';
		this._items['request'].innerHTML = str;
		this._hide('response');
	}

	updateResponse(data){
		this._items['response'].innerHTML = data.getResponse();
		this._show('response');
	}

	setContext(new_value){
		this._items['context'].socket._item.value = new_value;
	}

	setPrompt(new_value){
		this._items['prompt'].socket._item.value = new_value;
	}

	setPerspective(new_value){
		this._items['perspective'].socket._item.value = new_value;
		this._items['perspective']._state.setChanged();
		this.explainPerspective(new_value);
	}

	explainPerspective(new_value){
		let str = 'First-person response - the character replies in their own voice, as if they are speaking directly.';
		if(new_value == 'third_person'){
			str = 'Third-person response - you receive a narrative description of the character’s thoughts, emotions, or behavior in response to the situation.';
		}else if(new_value == 'other'){
			str = 'Other - you describe an action toward the character, and get a response or outcome.';
		}
		this._items['perspective_explanation'].innerHTML = str;
	}

	setMode(new_value){
		this._items['mode'].socket._item.value = new_value;
		this._items['mode']._state.setChanged();
		this.explainMode(new_value);
	}

	explainMode(new_value){
		let str = '';
		if(new_value == 'dialogue'){
			str = 'Dialogue - Expect a direct reply from the persona, as if you are having a conversation.';
		}else if(new_value == 'emotion'){
			str = 'Emotion - Request a description of the persona’s emotional reaction to the given context.';
		}else if(new_value == 'reaction'){
			str = 'Reaction - Get a behavioral or instinctive response from the persona — what they would do or how they would immediately respond.';
		}else if(new_value == 'interpretation'){
			str = 'Interpretation - Ask the persona to interpret or analyze the situation from their perspective.';
		}else if(new_value == 'action'){
			str = 'Action - Request to perform an action toward the persona — the persona is the target or recipient of the prompt.';
		}
		this._items['mode_explanation'].innerHTML = str;
	}

	constructor({ holder, demo_provider_id }) {
		super({ holder });
		this._demo_provider_id = demo_provider_id;
	}
}

export const DemoChatPanelSocketConnectable = Sup => class extends KoiSocketConnectable(Sup) {

	enable(){
		if(!this.isReady()){
			return;
		}
		this.socket.enable();
	}

	updateRequest(data){
		this.socket.updateRequest(data);
	}

	updateResponse(data){
		this.socket.updateResponse(data);
	}

	setContext(new_value){
		this.socket.setContext(new_value);
	}

	setPrompt(new_value){
		this.socket.setPrompt(new_value);
	}

	setPerspective(new_value){
		this.socket.setPerspective(new_value);
	}

	_explainPerspective(new_value){
		this.socket.explainPerspective(new_value);
	}

	setMode(new_value){
		this.socket.setMode(new_value);
	}

	_explainMode(new_value){
		this.socket.explainMode(new_value);
	}

	_constructSocket(){
		return new DemoChatPanelSocket({
			holder: this,
			demo_provider_id: this.getAttribute('demo_provider')
		});
	}

}

export class DemoChatPanel extends KoiOperationsInterceptable(
	DemoChatPanelSocketConnectable(
		KoiFormFieldChangesInterceptable(
			KoiBaseControl
		)
	)
) {

	static getTagName(){
		return "demo-chat-panel";
	}

	static getTag({
		element_id,
		element_class,
		demo_provider
	}){
		let tag_name = this.getTagName();
		let str_id = element_id ? ' id="' + element_id + '"' : '';
		let str_class = element_class ? ' class="' + element_class + '"' : '';
		let str_demo_provider = demo_provider ? ' demo_provider="' + demo_provider + '"' : '';
		return '<' + tag_name + str_id + str_class + str_demo_provider + '></' + tag_name + '>';
	}

	_handleOperated(event_detail){
		let action = event_detail.data.getAction();
		if(action === "send_request"){
			this.socket.disable();
		}
	}

	_displayWaiting(){
		super._displayWaiting();
	}

	_displayBadConnection(){
		super._displayBadConnection();
	}

	_displayError(){
		super._displayError();
	}

	_displayForbidden(){
		super._displayForbidden();
	}

	_updateSocket(){
		super._updateSocket();
	}

	_handleSocketChanged(event_detail){
		super._handleSocketChanged(event_detail);
		const field_name = event_detail.data.getFieldName();
		const new_value = event_detail.data.getFieldValue();
		if(field_name == 'context'){
			// this.attemptChangeContext(new_value);
		}else if(field_name == 'perspective'){
			this._explainPerspective(new_value);
		}else if(field_name == 'mode'){
			this._explainMode(new_value);
		}
	}

	_stopPropagationWhenSocketChanged(event){
		// Do not stop propagation
	}

	_stopPropagationWhenOperated(event){
		let action = event.detail.data.getAction();
		if(action === "step2"){
			return;
		}else if(action === "send_request"){
			return;
		}
		event.stopPropagation();
	}

}
