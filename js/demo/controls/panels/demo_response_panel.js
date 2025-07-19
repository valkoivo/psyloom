import { KoiSocketTemplateCapable, KoiCompositeSocket } from "../../../../libs/web-components-lib/socket.js";
import { KoiSocketConnectable, KoiBaseControl, KoiControlConnectorInteractable } from "../../../../libs/web-components-lib/controls/control.js";

export class DemoResponsePanelSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	_getEmptySchemaIds() {
		return {
			code_indent: this._holder.id + "_code_indent",
			done_div: this._holder.id + "_done_div",
			waiting_indent: this._holder.id + "_waiting_indent"
		};
	}

	getTemplate() {
		return '<p id="' + this.getID('done_div') + '" class="d-none">And here it is:</p>' +
		'<div class="card">' +
		'<div class="card-body">' +
			'<div class="code-block">' +
				'<div><span class="bracket">{</span></div>' +
					'<div class="indent d-none" id="' + this.getID('code_indent') + '">' +
					'</div>' +
					'<div class="indent d-none" id="' + this.getID('waiting_indent') + '">' +
					'</div>' +
				'<div><span class="bracket">}</span></div>' +
			'</div>' +
		'</div>' +
	'</div>';
	}

	displayWaiting(){
		const html = `<div>Loading... <span class="key" id="demo_response_timer">0.0 s</span></div>`;
		this._items['waiting_indent'].innerHTML = html;
		this._holder.show();
		this._show('waiting_indent');
		this._hide('code_indent');
		this._hide('done_div');

		this._timerStart = Date.now();
		this._timerInterval = setInterval(() => {
			const elapsed = (Date.now() - this._timerStart) / 1000;
			const timerEl = document.getElementById('demo_response_timer');
			if (timerEl) {
				timerEl.textContent = `${elapsed.toFixed(1)} s`;
			}
		}, 100);
	}

	displayError(){
		if (this._timerInterval) {
			clearInterval(this._timerInterval);
			this._timerInterval = null;
		}

		const html = `<div><span class="key">status</span>: <span class="value-string">error</span></div><div><span class="key">error</span>: <span class="value-string">Sorry! Something went wrong.</span></div>`;
		this._items['code_indent'].innerHTML = html;
		this._holder.show();
		this._hide('waiting_indent');
		this._show('code_indent');
		this._show('done_div');
	}

	displayResponse(response){
		if (this._timerInterval) {
			clearInterval(this._timerInterval);
			this._timerInterval = null;
		}
		if(!response){
			return;
		}
		const html = Object.entries(JSON.parse(response)).map(([key, value]) => {
			return `<div><span class="key">"${key}"</span>: <span class="value-string">"${value}"</span></div>`;
		}).join('');
		this._items['code_indent'].innerHTML = html;
		this._holder.show();
		this._hide('waiting_indent');
		this._show('code_indent');
		this._show('done_div');
	}

}

export class DemoResponsePanel extends KoiSocketConnectable(
	KoiControlConnectorInteractable(
		KoiBaseControl
	)
) {

	static getTagName(){
		return "demo-response-panel";
	}

	static getTag({
		element_id,
		element_class,
		provider_id,
		holder_id
	}){
		let tag_name = this.getTagName();
		let str_id = element_id ? ' id="' + element_id + '"' : '';
		let str_class = element_class ? ' class="' + element_class + '"' : '';
		let str_provider_id = provider_id ? ' provider_id="' + provider_id + '"' : '';
		let str_holder_id = holder_id ? ' holder_id="' + holder_id + '"' : '';
		return '<' + tag_name + str_id + str_class + str_provider_id + str_holder_id + '></' + tag_name + '>';
	}

	_updateSocket() {
		super._updateSocket();
		const response = this._connector._item.data.getResponse();
		if(response){
			this.socket.displayResponse(response);
		}else{
			this.socket.displayError();
		}
		const holder = document.getElementById(this.getAttribute('holder_id'));
		if(holder && typeof(holder.enable) === 'function'){
			holder.enable();
		}
	}

	_displayWaiting(){
		super._displayWaiting();
		this.socket.displayWaiting();
	}

	_displayForbidden() {
		super._displayForbidden();
		this.socket.displayError();
	}

	_displayError() {
		super._displayError();
		this.socket.displayError();
	}

	_displayBadConnection() {
		super._displayBadConnection();
		this.socket.displayError();
	}

	_displayBadResponse() {
		super._displayBadResponse();
		this.socket.displayError();
	}

	_updateSomethingWhenConnectorDataChanged(event_detail){
		super._updateSomethingWhenConnectorDataChanged(event_detail);
		this._state.setChanged();
	}

	_constructSocket(){
		return new DemoResponsePanelSocket({
			holder: this
		});
	}

}
