import { KoiSocketTemplateCapable, KoiSingleSocket } from "../../../../libs/web-components-lib/socket.js";
import { KoiSocketConnectable, KoiBaseControl, KoiControlConnectorInteractable } from "../../../../libs/web-components-lib/controls/control.js";

export class DemoResponsePanelSocket extends KoiSocketTemplateCapable(
	KoiSingleSocket
) {

	getTemplate() {
		return '<p>And here it is:</p>' +
		'<div class="card">' +
		'<div class="card-body">' +
			'<div class="code-block">' +
				'<div><span class="bracket">{</span></div>' +
					'<div class="indent" id="' + this.getID() + '">' +
					'</div>' +
				'<div><span class="bracket">}</span></div>' +
			'</div>' +
		'</div>' +
	'</div>';
	}

	displayResponse(response){
		if(!response){
			return;
		}
		const html = Object.entries(JSON.parse(response)).map(([key, value]) => {
			return `<div><span class="key">"${key}"</span>: <span class="value-string">"${value}"</span></div>`;
		}).join('');

		this._item.innerHTML = html;
		this._holder.show();
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
		this.socket.displayResponse(
			this._connector._item.data.getResponse()
		);
		const holder = document.getElementById(this.getAttribute('holder_id'));
		if(holder && typeof(holder.enable) === 'function'){
			holder.enable();
		}
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
