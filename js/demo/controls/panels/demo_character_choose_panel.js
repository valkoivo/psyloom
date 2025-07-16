/**
 * @module DemoGamePanel
 * Панель для демонстрации чат-бота.
 * 
 */

import { KoiSocketConnectable, KoiBaseControl } from "../../../../libs/web-components-lib/controls/control.js";
import { KoiCompositeSocket, KoiSocketTemplateCapable } from "../../../../libs/web-components-lib/socket.js";
import { KoiOperationsInterceptable } from "../../../../libs/web-components-lib/event_operated.js";

import { KoiIdButton } from "../../../../libs/web-components-lib/controls/buttons/control_idbutton.js";
if (customElements.get(KoiIdButton.getTagName()) === undefined) {
	customElements.define(KoiIdButton.getTagName(), KoiIdButton);
}

import { DemoGameBackButton } from "../buttons/demo_game_back_button.js";
if (customElements.get(DemoGameBackButton.getTagName()) === undefined) {
	customElements.define(DemoGameBackButton.getTagName(), DemoGameBackButton);
}

export class DemoCharacterChoosePanelSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds() {
		return {
			card_anna: this._holder.id + "_card_anna",
			card_george: this._holder.id + "_card_george",
			card_corin: this._holder.id + "_card_corin",
			choose_character_row: this._holder.id + "_choose_character_row",
			card_anna_description: this._holder.id + "_card_anna_description",
			card_george_description: this._holder.id + "_card_george_description",
			card_corin_description: this._holder.id + "_card_corin_description"
		};
	}

	getTemplate() {
		return '<h3>Step 1. Describe the Personality</h3>' +
		'<p>This is the first step in creating a persona through our API.</p>' +
		'<p>To help you get started, we’ve prepared three example personas.</p>' +
		'<p>You can choose any of them to see how a personality description turns into an API request.</p>' +
		'<div id="' + this.getID('choose_character_row') + '" class="row">' +
			'<div class="col-4">' +
				'<div id="' + this.getID('card_anna') + '" class="card card-character card-anna">' +
					'<div class="card-body">' +
						'<img class="portrait" src="./img/anna2_300_199.jpg">' +
					'</div>' +
					'<div class="card-footer">' +
						KoiIdButton.getTag({
							element_id: this._holder.id + '_anna_btn',
							item_action: 'choose_character',
							item_value: 'anna',
							btn_enabled: true,
							placeholder: 'Anna',
							css_class: 'choose-btn'
						}) +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="col-4">' +
				'<div id="' + this.getID('card_george') + '" class="card card-character card-george">' +
					'<div class="card-body">' +
						'<img class="portrait" src="./img/george_300_199.jpg">' +
					'</div>' +
					'<div class="card-footer">' +
						KoiIdButton.getTag({
							element_id: this._holder.id + '_george_btn',
							item_action: 'choose_character',
							item_value: 'george',
							btn_enabled: true,
							placeholder: 'George',
							css_class: 'choose-btn'
						}) +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="col-4">' +
				'<div id="' + this.getID('card_corin') + '" class="card card-character card-corin">' +
					'<div class="card-body">' +
						'<img class="portrait" src="./img/corin_300_199.jpg">' +
					'</div>' +
					'<div class="card-footer">' +
						KoiIdButton.getTag({
							element_id: this._holder.id + '_corin_btn',
							item_action: 'choose_character',
							item_value: 'corin',
							btn_enabled: true,
							placeholder: 'Corin',
							css_class: 'choose-btn'
						}) +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div id="' + this.getID('card_anna_description') + '" class="card card_description mt-3 d-none">' +
			'<div class="card-header">' +
				DemoGameBackButton.getTag({
					element_id: this._holder.id + '_back_btn_1',
					item_action: 'back',
					btn_enabled: true,
					placeholder: ''
				}) +
				'<h3>Anna</h3>' +
			'</div>' +
			'<div class="card-body card-body-character">' +
				'<div class="portrait-holder"><img class="portrait" src="./img/anna2_300_199.jpg"></div>' +
				'<div>Anna is a lively and strong-minded 27-year-old. She feels the world through touch and movement. She’s a designer who made her own special world of toys — creative and full of heart. She doesn’t like waiting and always stands up for what’s right. Anna moves quickly and enjoys when things happen right away.</div>' +
			'</div>' +
			'<div class="card-body">' +
				'<p class="comment">You can send this description in an API request like this:</p>' +
				'<div class="code-block">' +
					'<div><span class="key">POST</span> https://api.psyloom.com/api/v1/audience</div>' +
					'<div><span class="bracket">{</span></div>' +
						'<div class="indent">' +
						'<div><span class="key">"description"</span>: <span class="value-string">"Anna is a lively and strong-minded 27-year-old. She feels the world through touch and movement. She’s a designer who made her own special world of toys — creative and full of heart. She doesn’t like waiting and always stands up for what’s right. Anna moves quickly and enjoys when things happen right away."</span></div>' +
						'</div>' +
					'<div><span class="bracket">}</span></div>' +
				'</div>' +
			'</div>' +
			'<div class="card-footer">' +
				'<p class="comment">Now, let\'s move on to the next step.</p>' +
				KoiIdButton.getTag({
					element_id: this._holder.id + '_next_btn_1',
					item_action: 'step2',
					item_value: 'anna',
					btn_enabled: true,
					placeholder: 'Step 2'
				}) +
			'</div>' +
		'</div>' +
		'<div id="' + this.getID('card_george_description') + '" class="card card_description mt-3 d-none">' +
			'<div class="card-header">' +
				DemoGameBackButton.getTag({
					element_id: this._holder.id + '_back_btn_2',
					item_action: 'back',
					btn_enabled: true,
					placeholder: ''
				}) +
				'<h3>George</h3>' +
			'</div>' +
			'<div class="card-body card-body-character">' +
				'<div class="portrait-holder"><img class="portrait" src="./img/george_300_199.jpg"></div>' +
				'<div>George is a confident and experienced business leader in his 40s. He works as a commercial director at a large company and always thinks about numbers, results, and strategy. He speaks clearly, makes fast decisions, and expects others to do the same. He doesn’t like small talk — he prefers action and results.</div>' +
			'</div>' +
			'<div class="card-body">' +
				'<p class="comment">You can send this description in an API request like this:</p>' +
				'<div class="code-block">' +
					'<div><span class="key">POST</span> https://api.psyloom.com/api/v1/audience</div>' +
					'<div><span class="bracket">{</span></div>' +
						'<div class="indent">' +
						'<div><span class="key">"description"</span>: <span class="value-string">"George is a confident and experienced business leader in his 40s. He works as a commercial director at a large company and always thinks about numbers, results, and strategy. He speaks clearly, makes fast decisions, and expects others to do the same. He doesn’t like small talk — he prefers action and results."</span></div>' +
						'</div>' +
					'<div><span class="bracket">}</span></div>' +
				'</div>' +
			'</div>' +
			'<div class="card-footer">' +
				'<p class="comment">Now, let\'s move on to the next step.</p>' +
				KoiIdButton.getTag({
					element_id: this._holder.id + '_next_btn_2',
					item_action: 'step2',
					item_value: 'george',
					btn_enabled: true,
					placeholder: 'Step 2'
				}) +
			'</div>' +
		'</div>' +
		'<div id="' + this.getID('card_corin_description') + '" class="card card_description mt-3 d-none">' +
			'<div class="card-header">' +
				DemoGameBackButton.getTag({
					element_id: this._holder.id + '_back_btn_3',
					item_action: 'back',
					btn_enabled: true,
					placeholder: ''
				}) +
				'<h3>Corin</h3>' +
			'</div>' +
			'<div class="card-body card-body-character">' +
				'<div class="portrait-holder"><img class="portrait" src="./img/corin_300_199.jpg"></div>' +
				'<div>Corin is a tough and proud dwarf with a big beard and a bigger heart. He’s strong, stubborn, and always ready for a challenge. He loves working with his hands — building, fixing, mining. He speaks in a deep voice and doesn’t trust easily, but once he does, he’s loyal for life. Don’t try to fool him — he sees through nonsense right away.</div>' +
			'</div>' +
			'<div class="card-body">' +
				'<p class="comment">You can send this description in an API request like this:</p>' +
				'<div class="code-block">' +
					'<div><span class="key">POST</span> https://api.psyloom.com/api/v1/audience</div>' +
					'<div><span class="bracket">{</span></div>' +
						'<div class="indent">' +
						'<div><span class="key">"description"</span>: <span class="value-string">"Corin is a tough and proud dwarf with a big beard and a bigger heart. He’s strong, stubborn, and always ready for a challenge. He loves working with his hands — building, fixing, mining. He speaks in a deep voice and doesn’t trust easily, but once he does, he’s loyal for life. Don’t try to fool him — he sees through nonsense right away."</span></div>' +
						'</div>' +
					'<div><span class="bracket">}</span></div>' +
				'</div>' +
			'</div>' +
			'<div class="card-footer">' +
				'<p class="comment">Now, let\'s move on to the next step.</p>' +
				KoiIdButton.getTag({
					element_id: this._holder.id + '_next_btn_3',
					item_action: 'step2',
					item_value: 'corin',
					btn_enabled: true,
					placeholder: 'Step 2'
				}) +
			'</div>' +
		'</div>';
	}

	showCharacter(character_name){
		this._items['card_anna'].classList.remove('active');
		this._items['card_george'].classList.remove('active');
		this._items['card_corin'].classList.remove('active');
		this._items['card_' + character_name].classList.add('active');
		this._hide('choose_character_row');
		this._show('card_' + character_name + '_description');
	}

	showCharacterRow(){
		this._items['card_anna'].classList.remove('active');
		this._items['card_george'].classList.remove('active');
		this._items['card_corin'].classList.remove('active');
		this._show('choose_character_row');
		this._hide('card_anna_description');
		this._hide('card_george_description');
		this._hide('card_corin_description');
	}

}

export const DemoCharacterChoosePanelSocketConnectable = Sup => class extends KoiSocketConnectable(Sup) {

	_constructSocket(){
		return new DemoCharacterChoosePanelSocket({
			holder: this,
			user_connector_id: this.getAttribute('provider_id')
		});
	}

}

export class DemoCharacterChoosePanel extends KoiOperationsInterceptable(
	DemoCharacterChoosePanelSocketConnectable(
		KoiBaseControl
	)
) {

	static getTagName(){
		return "demo-character-choose-panel";
	}

	static getTag({
		element_id,
		element_class
	}){
		let tag_name = this.getTagName();
		let str_id = element_id ? ' id="' + element_id + '"' : '';
		let str_class = element_class ? ' class="' + element_class + '"' : '';
		return '<' + tag_name + str_id + str_class + '></' + tag_name + '>';
	}

	_handleOperated(event_detail){
		let action = event_detail.data.getAction();
		if(action === "choose_character"){
			this.socket.showCharacter(
				event_detail.data.getValue()
			);
		}else if(action === "back"){
			this.socket.showCharacterRow();
		}
		// this.attemptChangeValue(action);
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

	_stopPropagationWhenOperated(event){
		let action = event.detail.data.getAction();
		if(action === "step2"){
			return;
		}
		event.stopPropagation();
	}

}
