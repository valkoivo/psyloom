class KoiSessionStorage {

	_delete(){
		sessionStorage.removeItem(this._id);
	}

	getData(){
		let new_data = JSON.parse(sessionStorage.getItem(this._id));
		// TODO - Обдумать вариант return JSON.parse(sessionStorage.getItem(name) || '[]');
		if(new_data == null){
			return {};
		}
		return new_data;
	}

	setData(data_dict){
		sessionStorage.setItem(this._id, JSON.stringify(data_dict));
	}

	constructor(session_storage_id){
		this._id = session_storage_id;
	}

}

export const KoiStorable = Sup => class extends Sup {

	_prepareDataValuesFromSessionStorage(){
		this.data.setValues(
			this._session_storage.getData()
		);
	}

	_saveDataToSessionStorage(){
		this._session_storage.setData(
			this.data.getRawValuesAsDict()
		);
	}

	_updateSomethingWhenChanged(){
		super._updateSomethingWhenChanged();
		this._saveDataToSessionStorage();
	}

	_onConstructed() {
		super._onConstructed();
		let session_storage_id = 'connectorData_' + this.id;
		this._session_storage = new KoiSessionStorage(session_storage_id);
	}

	_onBeforeConnected(){
		super._onBeforeConnected();
		this._prepareDataValuesFromSessionStorage();
	}
}