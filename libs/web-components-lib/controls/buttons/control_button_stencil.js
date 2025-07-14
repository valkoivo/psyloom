/**
 * @module KoiButtonStencil
 * 
 * @version 1.13.0
 * @license MIT License
 * Copyright (c) 2025 Koi
*/

import { KoiSocketConnectable, KoiBaseControl } from "../control.js";
import { KoiOperationsInterceptable, KoiOperationEventDispatchable } from "../../event_operated.js";

export class KoiButtonStencil extends KoiOperationsInterceptable(
	KoiOperationEventDispatchable(
		KoiSocketConnectable(
			KoiBaseControl
		)
	)
) {

	_updateStateCodeWhenOperated(event_detail){
		super._updateStateCodeWhenOperated(event_detail);
		this._state.setChanged();
	}

	_dispatchEventsWhenChangedAfterOperated(){
		super._dispatchEventsWhenChangedAfterOperated();
		this._dispatchOperationEvent();
	}

}
