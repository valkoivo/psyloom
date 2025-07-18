import { KoiIdButton, KoiButtonNativeButtonSocket } from "../../../../libs/web-components-lib/controls/buttons/control_idbutton.js";

export class DemoGameBackButtonSocket extends KoiButtonNativeButtonSocket {

	_getButtonTextTemplate(){
		return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backspace" viewBox="0 0 16 16">' +
			'<path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/>' +
			'<path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>' +
			'</svg>';
	}

}

export class DemoGameBackButton extends KoiIdButton {

	static getTagName(){
		return "demo-game-back-button";
	}

	_constructSocket(){
		return new DemoGameBackButtonSocket({
			holder: this,
			btn_class: this.getAttribute('btn_class'), 
			btn_type: this.getAttribute('btn_type'), 
			btn_enabled: this.hasAttribute('btn_enabled'), 
			btn_text: this.innerHTML
		});
	}

}
