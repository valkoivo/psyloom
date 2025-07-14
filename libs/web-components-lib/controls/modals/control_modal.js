/**
 * @module KoiModal
 * Модальное окно.
 * 
 * id у компонента обязателен
*/

import { KoiBaseControl, KoiSocketConnectable } from "../../../../libs/web-components-lib/controls/control.js";
import { KoiSocketTemplateCapable, KoiCompositeSocket } from "../../../../libs/web-components-lib/socket.js";

export class KoiModalSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {

	getTemplate(){
		let str = '<div id="' + this.getID('wnd') + '" class="modal fade" tabindex="-1">' +
			'<div class="modal-dialog">' +
				'<div class="modal-content">' +
					'<div class="modal-header">' +
						'<h4 id="' + this.getID('title') + '" class="modal-title">Modal</h4>' +
						'<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
					'</div>' +
					'<div id="' + this.getID('body') + '" class="modal-body">' +
						'<p>body</p>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>';
		return str;
	}

	_getEmptySchemaIds(){
		return {
			wnd: this._holder.id + "_wnd",
			title: this._holder.id + "_title",
			body: this._holder.id + "_body"
		};
	}

	show(){
		this.bootstrapModal.show();
	}

	hide(){
		this.bootstrapModal.hide();
	}

	setTitle(title){
		if(this._items.title){
			this._items.title.innerHTML = title;
		}
	}

	setBody(content){
		if(this._items.body){
			this._items.body.innerHTML = content;
		}
	}

	isShown(){
		return this._items.wnd && this._items.wnd.classList.contains("show");
	}

	_createBootstrapModalObjects(){
		// TODO - На disconnectedCallback этот объект 
		// должен уничтожаться,
		// но пока что я не нашел функции уничтожения.
		this.bootstrapModal = new bootstrap.Modal(
			this._items['wnd']
		);
	}

	prepare(){
		super.prepare();
		this._createBootstrapModalObjects();
	}

	constructor({holder}){
		super({holder});
		// Ссылка на объект Bootstrap Modal
		this.bootstrapModal = null;
	}

}

export const KoiModalSocketCapable = Sup => class extends KoiSocketConnectable(Sup) {

	_constructSocket(){
		return new KoiModalSocket({ holder: this });
	}

	_showModal(){
		this.socket.show();
	}

	_hideModal(){
		this.socket.hide();
	}

	_setModalTitle(title){
		this.socket.setTitle(title);
	}

	_setModalBody(content){
		this.socket.setBody(content);
	}

	isModalShown(){
		return this.socket.isShown();
	}

}

export class KoiModal extends KoiModalSocketCapable(
	KoiBaseControl
) {

	_displayWaiting(event_details){
		this._log('displayWaiting()');
		// Для того, чтобы окно показывалось даже, 
		// если модель еще не загружена,
		// сам компонент окна не должен быть скрыт.
		this.show();
	}

	attemptShowModal(title, template){
		this._log('attemptShowModal()');
		this._setModalTitle(title);
		this._setModalBody(template);
		this._showModal();
	}

	attemptHideModal(){
		this._log('attemptHideModal()');
		this._hideModal();
	}

}
