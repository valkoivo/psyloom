import { KoiIdLink } from "../../../../libs/web-components-lib/controls/buttons/control_idbutton.js";

export class DemoAuthModeSwitcherLink extends KoiIdLink {

	static getTagName(){
		return "demo-auth-mode-switcher-link";
	}

	_getDispatchableOperationEventCode() {
		return "blogger-auth-mode-switch";
	}
}
