class KoiLocalStorage {

	_delete(){
		localStorage.removeItem(this._id);
	}

	getData(){
		let new_data = JSON.parse(localStorage.getItem(this._id));
		// TODO - Обдумать вариант return JSON.parse(sessionStorage.getItem(name) || '[]');
		if(new_data == null){
			return {};
		}
		return new_data;
	}

	setData(data_dict){
		localStorage.setItem(this._id, JSON.stringify(data_dict));
	}

	constructor(storage_id){
		this._id = storage_id;
	}

}

export const KoiLocalStorable = Sup => class extends Sup {

	_prepareDataValuesFromLocalStorage(){
		this.data.setValues(
			this._local_storage.getData()
		);
	}

	_saveDataToLocalStorage(){
		this._local_storage.setData(
			this.data.getRawValuesAsDict()
		);
	}

	_updateSomethingWhenChanged(){
		super._updateSomethingWhenChanged();
		this._saveDataToLocalStorage();
	}

	_onConstructed() {
		super._onConstructed();
		let storage_id = 'connectorData_' + this.id;
		this._local_storage = new KoiLocalStorage(storage_id);
	}

	_onBeforeConnected(){
		super._onBeforeConnected();
		this._prepareDataValuesFromLocalStorage();
	}
}
