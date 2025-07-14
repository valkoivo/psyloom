/**
 * @module KoiPaginator
 * A component for displaying a paginator for a Laravel-style CRUD API.
 *
 * @version 2.0.0
 * @license MIT
 * Copyright (c) 2025 Koi
 *
 * id is required
 * provider_id is required
 */

import { KoiPanel } from "../panels/control_panel.js";
import { KoiSocketTemplateCapable, KoiCompositeSocket } from "../../socket.js";
import { KoiSocketConnectable, KoiControlConnectorInteractable } from "../control.js";
import { KoiSingleConnector } from "../../connector.js";
import { KoiIdLink } from "../buttons/control_idbutton.js";
import { KoiOperationsInterceptable } from "../../event_operated.js";

if (customElements.get(KoiIdLink.getTagName()) === undefined) {
	customElements.define(KoiIdLink.getTagName(), KoiIdLink);
}

class KoiPaginatorSocket extends KoiSocketTemplateCapable(
	KoiCompositeSocket
) {
	_getEmptySchemaIds() {
		return {
			ul: this._holder.id + '_ul'
		};
	}

	getTemplate() {
		return `<nav><ul id="${this.getID('ul')}" class="pagination"></ul></nav>`;
	}

	_getButtonTemplate(page_num, active) {
		let page_id = this._holder.id + '_' + page_num;
		let active_class = active ? 'active' : '';
		return `<li class="page-item ${active_class}">` +
			KoiIdLink.getTag({
				element_id: page_id,
				item_id: page_num,
				btn_class: 'page-link',
				el_class: active_class,
				placeholder: page_num
			}) +
		`</li>`;
	}

	updateView({current_page, per_page, total}) {
		if (!total || total < 1) {
			this._items.ul.innerHTML = '';
			return;
		}
		let str = '';
		let pages = Math.ceil(total / per_page);
		if (pages < 2) {
			this._items.ul.innerHTML = '';
			return;
		}
		for (let i = 1; i <= pages; i++) {
			let active = (current_page == i);
			str += this._getButtonTemplate(i, active);
		}
		this._items.ul.innerHTML = str;
	}
}

export class KoiPaginatorConnector extends KoiSingleConnector {
	attemptLoadPage(page) {
		this._item.attemptLoadAPI({ page: page });
	}

	getPaginationData() {
		if (this._item && this._item.data && typeof this._item.data.getRawValuesAsDict === 'function') {
			return this._item.data.getRawValuesAsDict();
		}
		return { current_page: 1, per_page: 1, total: 0 };
	}
}

export class KoiPaginator extends KoiControlConnectorInteractable(
	KoiSocketConnectable(
		KoiOperationsInterceptable(
			KoiPanel
		)
	)
) {
	static getTagName() {
		return 'koi-paginator';
	}

	static getTag({element_id, provider_id, element_class}){
		let tag_name = this.getTagName();
		let str_id = element_id ? ` id="${element_id}"` : '';
		let str_provider_id = provider_id ? ` provider_id="${provider_id}"` : '';
		let str_class = element_class ? ` class="${element_class}"` : '';
		return `<${tag_name}${str_id}${str_provider_id}${str_class}></${tag_name}>`;
	}

	_constructSocket() {
		return new KoiPaginatorSocket({ holder: this });
	}

	_constructConnector() {
		return new KoiPaginatorConnector({
			holder: this,
			id: this._getProviderId()
		});
	}

	_handleOperated(event_detail) {
		const page = event_detail.data.getItemId();
		if (page) {
			this._connector.attemptLoadPage(page);
		}
	}

	_updateSocket() {
		super._updateSocket();
		if (this.socket && this._connector) {
			this.socket.updateView(this._connector.getPaginationData());
		}
	}

	_updateStateCodeWhenConnectorDataChanged(event_detail) {
		super._updateStateCodeWhenConnectorDataChanged(event_detail);
		this._state.setChanged();
	}
}
