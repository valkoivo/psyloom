/**
 * @module DemoGamePanel
 * Панель для демонстрации чат-бота.
 * 
 */

import { KoiSocketConnectable, KoiBaseControl, KoiControlConnectorInteractable } from "../../../../libs/web-components-lib/controls/control.js";
import { KoiCompositeSocket, KoiSocketTemplateCapable } from "../../../../libs/web-components-lib/socket.js";
import { KoiOperationsInterceptable } from "../../../../libs/web-components-lib/event_operated.js";
import { KoiStringData, KoiStringDataCapable } from "../../../../libs/web-components-lib/data_objects.js";
import { KoiFormFieldChangesInterceptable } from "../../../../libs/web-components-lib/controls/forms/event_form_field_change.js";
import { DemoUserConnector } from "../../providers/demo_user_api_provider.js";

import { DemoAPIV1QueryProvider } from "../../../demo/providers/demo_api_v1_query_provider.js";
if (customElements.get(DemoAPIV1QueryProvider.getTagName()) === undefined) {
	customElements.define(DemoAPIV1QueryProvider.getTagName(), DemoAPIV1QueryProvider);
}
import { DemoCharacterChoosePanel } from "./demo_character_choose_panel.js";
if (customElements.get(DemoCharacterChoosePanel.getTagName()) === undefined) {
	customElements.define(DemoCharacterChoosePanel.getTagName(), DemoCharacterChoosePanel);
}
import { DemoGetPersonaPanel } from "./demo_get_persona_panel.js";
if (customElements.get(DemoGetPersonaPanel.getTagName()) === undefined) {
	customElements.define(DemoGetPersonaPanel.getTagName(), DemoGetPersonaPanel);
}
import { DemoChatPanel } from "./demo_chat_panel.js";
if (customElements.get(DemoChatPanel.getTagName()) === undefined) {
	customElements.define(DemoChatPanel.getTagName(), DemoChatPanel);
}

export class DemoGamePanelSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds() {
		return {
			api_provider: this._holder.id + "_api_provider",
			character_choose: this._holder.id + "_character_choose",
			step2: this._holder.id + "_step2",
			chat: this._holder.id + "_chat"
		};
	}

	getTemplate() {
		return DemoAPIV1QueryProvider.getTag({
			element_id: this.getID('api_provider'),
			save_url: 'https://api.psyloom.com/api/v1/demoquery',
			user_connector: this._user_connector_id
		}) +
		DemoCharacterChoosePanel.getTag({
			element_id: this.getID('character_choose')
		}) +
		DemoGetPersonaPanel.getTag({
			element_id: this.getID('step2')
		}) +
		DemoChatPanel.getTag({
			element_id: this.getID('chat'),
			element_class: 'demo-chat-panel',
			demo_provider: this.getID('api_provider')
		});
	}

	showStep1(){
		this._showPanel("character_choose");
		document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
	}

	showStep2(){
		this._showPanel("step2");
		document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
	}

	showStep3(){
		this._showPanel("chat");
		document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
	}

	_showPanel(key) {
		let ids = this._getEmptySchemaIds();
		for(let panel in ids){
			if(panel === key){
				this._show(panel);
			}else{
				this._hide(panel);
			}
		}
	}

	showSuccessfulAuth(){
		this._holder.show();
	}

	showNotAuthorized(){
		this._holder.hide();
	}

	prepare() {
		super.prepare();
		this.showStep1();
	}

	constructor({ holder, user_connector_id }) {
		super({ holder });
		this._user_connector_id = user_connector_id;
	}
}

export const DemoGamePanelSocketConnectable = Sup => class extends KoiSocketConnectable(Sup) {

	_constructSocket(){
		return new DemoGamePanelSocket({
			holder: this,
			user_connector_id: this.getAttribute('provider_id')
		});
	}

}

export class DemoGamePanel extends KoiOperationsInterceptable(
	DemoGamePanelSocketConnectable(
		KoiStringDataCapable(
			KoiControlConnectorInteractable(
				KoiFormFieldChangesInterceptable(
					KoiBaseControl
				)
			)
		)
	)
) {

	static getTagName(){
		return "demo-game-panel";
	}

	static getTag({
		element_id,
		element_class,
		user_connector
	}){
		let tag_name = this.getTagName();
		let str_id = element_id ? ' id="' + element_id + '"' : '';
		let str_class = element_class ? ' class="' + element_class + '"' : '';
		let str_user_connector = user_connector ? ' provider_id="' + user_connector + '"' : '';
		return '<' + tag_name + str_id + str_class + str_user_connector + '></' + tag_name + '>';
	}

	_getInterceptableOperateEventCode(){
		return ["demo-game-mode-switch", "koi-operated"];
	}

	attemptUpdateRequest(data){
		this.socket._items['chat'].updateRequest(data);
	}

	attemptChangePerson(character_name){
		this.socket._items['api_provider'].data.setPersonId(character_name);
	}

	attemptChangeInitialContext(character_name){
		let new_context = '';
		if(character_name == 'anna'){
			new_context = 'Anna is browsing an online store that sells handmade, eco-friendly home items. She stumbles upon a limited-edition ceramic lamp designed by an independent artist. The product description emphasizes the tactile texture of the material, the story behind the design, and how quickly stock runs out due to high demand.';
		}else if(character_name == 'george'){
			new_context = 'We are preparing to write a business email to George — a commercial director at a large company. We want to understand what kind of message would catch his attention, align with his values, and motivate him to respond positively. Our goal is to craft a compelling and effective proposal that speaks to his priorities.';
		}else if(character_name == 'corin'){
			new_context = 'I find Corin in the stone workshop of a small mountain village. He’s busy repairing a broken axe head, his hands covered in soot and metal dust. The air smells of iron and coal. I’ve heard he’s one of the most skilled craftsmen in the region — and I need his help forging a special tool for an upcoming expedition into dangerous territory. I approach him, hoping to earn his attention and cooperation.';
		}
		this.socket._items['api_provider'].data.setContext(new_context);
		this.socket._items['chat'].setContext(new_context);
	}

	attemptChangeContext(new_context){
		this.socket._items['api_provider'].data.setContext(new_context);
	}

	attemptChangeInitialPrompt(character_name){
		let new_prompt = '';
		if(character_name == 'anna'){
			new_prompt = 'From a marketing perspective, describe Anna’s emotional response to this product and what elements most strongly influence her desire to buy it.';
		}else if(character_name == 'george'){
			new_prompt = 'Write a clear, concise, and compelling message addressed to George that reflects his priorities and communication style. The message should aim to spark interest and encourage him to consider the proposal seriously.';
		}else if(character_name == 'corin'){
			new_prompt = 'Corin, I’ve heard your forge can craft tools that outlast storms and stone. I’ve got a task that needs more than just iron — it needs your kind of work. Mind if I explain?';
		}
		this.socket._items['api_provider'].data.setPrompt(new_prompt);
		this.socket._items['chat'].setPrompt(new_prompt);
	}

	attemptChangePrompt(new_prompt){
		this.socket._items['api_provider'].data.setPrompt(new_prompt);
	}

	attemptChangeInitialPerspective(character_name){
		let new_value = '';
		if(character_name == 'anna'){
			new_value = 'third_person';
		}else if(character_name == 'george'){
			new_value = 'other';
		}else if(character_name == 'corin'){
			new_value = 'first_person';
		}
		this.socket._items['api_provider'].data.setPerspective(new_value);
		this.socket._items['chat'].setPerspective(new_value);
	}

	attemptChangePerspective(new_value){
		this.socket._items['api_provider'].data.setPerspective(new_value);
	}

	attemptChangeInitialMode(character_name){
		let new_value = '';
		if(character_name == 'anna'){
			new_value = 'emotion';
		}else if(character_name == 'george'){
			new_value = 'action';
		}else if(character_name == 'corin'){
			new_value = 'dialogue';
		}
		this.socket._items['api_provider'].data.setMode(new_value);
		this.socket._items['chat'].setMode(new_value);
	}

	attemptChangeMode(new_value){
		this.socket._items['api_provider'].data.setMode(new_value);
	}

	attemptSendRequest(){
		this.socket._items['api_provider'].attemptSaveAPI(
			this.socket._items['api_provider'].data.getValuesAsDict()
		);
	}

	_handleOperated(event_detail){
		let action = event_detail.data.getAction();
		if(action === "step2"){
			this.socket.showStep2();
			const character_name = event_detail.data.getValue();
			if(!character_name){
				return;
			}
			this.attemptChangePerson(
				character_name
			);
			this.attemptChangeInitialContext(
				character_name
			);
			this.attemptChangeInitialPrompt(
				character_name
			);
			this.attemptChangeInitialPerspective(
				character_name
			);
			this.attemptChangeInitialMode(
				character_name
			);
			this.attemptUpdateRequest(
				this.socket._items['api_provider'].data
			);
		}else if(action === "step3"){
			this.socket.showStep3();
		}else if(action === "step1"){
			this.socket.showStep1();
		}else if(action === "send_request"){
			this.attemptSendRequest();
		}
	}

	_handleSocketChanged(event_detail){
		super._handleSocketChanged(event_detail);
		const field_name = event_detail.data.getFieldName();
		const new_value = event_detail.data.getFieldValue();
		if(field_name == 'context'){
			this.attemptChangeContext(new_value);
			this.attemptUpdateRequest(
				this.socket._items['api_provider'].data
			);
		}else if(field_name == 'prompt'){
			this.attemptChangePrompt(new_value);
			this.attemptUpdateRequest(
				this.socket._items['api_provider'].data
			);
		}else if(field_name == 'perspective'){
			this.attemptChangePerspective(new_value);
			this.attemptUpdateRequest(
				this.socket._items['api_provider'].data
			);
		}else if(field_name == 'mode'){
			this.attemptChangeMode(new_value);
			this.attemptUpdateRequest(
				this.socket._items['api_provider'].data
			);
		}
	}

	static getAuthPanelModeChangedEventCode(){
		return 'demo-game-panel-mode-switched';
	}

	_displayWaiting(){
		super._displayWaiting();
	}

	_displayBadConnection(){
		super._displayBadConnection();
		this.socket.showNotAuthorized();
	}

	_displayError(){
		super._displayError();
		this.socket.showNotAuthorized();
	}

	_displayForbidden(){
		super._displayForbidden();
		this.socket.showNotAuthorized();
	}

	_updateSocket(){
		super._updateSocket();
		this.socket.showSuccessfulAuth();
	}

	_constructConnector(){
		return new DemoUserConnector({
			holder: this, 
			id: this._getProviderId()
		});
	}

}
