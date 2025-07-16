/**
 * @module APIKeysCRUDAppendNewItemDialog
 * This is a simple dialog component needed for a CRUD panel. 
 * It is used to obtain the name of a new entry from the user 
 * and the command to add it. The component includes an input 
 * field and an "Add" button. Since the component does not require 
 * any commands other than the "Add" command, it hides the second 
 * button provided by the base class. 
 * 
 * The component also has an additional feature. Occasionally, 
 * it is necessary to add two records with the same name. When 
 * the text in the input field remains unchanged, the component’s 
 * data remains unchanged as well, meaning that clicking the "Add" 
 * button again does not trigger the event. This makes it impossible 
 * to add a second record with the same name. To address this issue, 
 * the component calls the _state.setChanged() method each time it 
 * processes the "Add" button clicks.
 * 
 * @version 1.0.0
 * @license MIT License
 * Copyright (c) 2025 Koi
*/

import { CRUDSampleAppendItemDialog, CRUDSampleAppendItemDialogSocket } from "../../../crud/controls/dialogs/crud_sample_append_item_dialog.js"
import { KoiDataElementString } from "../../../../libs/web-components-lib/data_element.js"

import { BloggerIdButton } from "../../../blogger/controls/buttons/blogger_idbutton.js";
if (customElements.get(BloggerIdButton.getTagName()) === undefined) {
	customElements.define(BloggerIdButton.getTagName(), BloggerIdButton);
}

export class APIKeysCRUDAppendNewItemDialogSocket extends CRUDSampleAppendItemDialogSocket {

	_getApplyButtonTemplate(){
		return BloggerIdButton.getTag({
			element_id: this.getID('first_button'),
			item_action: this._holder.constructor.getApplyActionCode(),
			btn_class: 'btn-primary me-1', 
			btn_enabled: true,
			placeholder: this._apply_caption
		});
	}

	_getLocalizedText(lang, key) {
		const dictionary = {
			first_button: {
				english: 'Create',
				russian: 'Создать'
			},
			placeholder: {
				english: 'Name for the key',
				russian: 'Введите название ключа'
			}
		};
		return (dictionary[key] && dictionary[key][lang]) ? dictionary[key][lang] : dictionary[key]['en'];
	}

	changeLanguage(language){
		this._items.first_button.changeText(
			this._getLocalizedText(language, 'first_button')
		);
		this._items.form_field.querySelector('.form-label').innerHTML = this._getLocalizedText(language, 'placeholder');
	}

}

export class APIKeysCRUDAppendNewItemDialog extends CRUDSampleAppendItemDialog {

	static getTagName(){
		return 'api-keys-crud-append-new-item-dialog';
	}

	_constructSocket(){
		return new APIKeysCRUDAppendNewItemDialogSocket({
			holder: this,
			apply_caption: this.getAttribute('apply_caption'),
			cancel_caption: this.getAttribute('cancel_caption'),
			message: this.getAttribute('message')
		});
	}

	changeLanguage(language){
		this.socket.changeLanguage(language);
	}

}
