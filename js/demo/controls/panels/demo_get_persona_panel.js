/**
 * @module DemoGetPersonaPanel
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

export class DemoGetPersonaPanelSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds() {
		return {
			card_anna: this._holder.id + "_card_anna"
		};
	}

	getTemplate() {
		return '<div class="step-header">' +
			DemoGameBackButton.getTag({
				element_id: this._holder.id + '_back_btn_5',
				item_action: 'step1',
				btn_enabled: true,
				placeholder: ''
			}) +
			'<h3>Step 2. Psyloom Builds the Mind</h3>' +
		'</div>' +
		'<p>Once you\'ve submitted a personality description, Psyloom analyzes it and constructs a rich psychological model — including traits, values, emotions, and behavioral tendencies.</p>' +
		'<p>This process takes place on our servers and usually takes around 5 minutes.</p>' +
		'<p>You can check the status of the model generation by sending a request to the API.</p>' +
		'<div class="card">' +
			'<div class="card-body">' +
				'<div class="code-block">' +
					'<div><span class="key">GET</span> https://api.psyloom.com/api/v1/audience/{process_id}</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<p>You will receive a response that looks like this:.</p>' +
		'<div class="card">' +
			'<div class="card-body">' +
				'<div class="code-block">' +
					'<div><span class="bracket">{</span></div>' +
						'<div class="indent">' +
						'<div><span class="key">"status"</span>: <span class="value-string">"done"</span></div>' +
						'<div><span class="key">"person_id"</span>: <span class="value-string">"mYjq3Cy3oqmz2FdAKB10/pfISuNss37p4pIWnPVVVTcvj8MLzWK9T+AQayIjQR4gHiSzFoER24xpynkMBaUKPmklQMoiXIthFAUKr0+mEFMzIFyY"</span></div>' +
						'</div>' +
					'<div><span class="bracket">}</span></div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<p>In this response, <b>person_id</b> is the identifier of the digital persona you will use in your future requests.</p>' +
		'<p>And now, it\'s time to let you interact with the persona that has been created.</p>' +
		KoiIdButton.getTag({
			element_id: this._holder.id + '_next_btn_4',
			item_action: 'step3',
			btn_enabled: true,
			placeholder: 'Chat now!'
		});
	}

}

export const DemoGetPersonaPanelSocketConnectable = Sup => class extends KoiSocketConnectable(Sup) {

	_constructSocket(){
		return new DemoGetPersonaPanelSocket({
			holder: this,
			user_connector_id: this.getAttribute('provider_id')
		});
	}

}

export class DemoGetPersonaPanel extends KoiOperationsInterceptable(
	DemoGetPersonaPanelSocketConnectable(
		KoiBaseControl
	)
) {

	static getTagName(){
		return "demo-get-persona-panel";
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

	_stopPropagationWhenOperated(event){
		let action = event.detail.data.getAction();
		if(action === "step3"){
			return;
		}else if(action === "step1"){
			return;
		}
		event.stopPropagation();
	}

}
