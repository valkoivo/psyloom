/**
 * @module KoiAPIProvider
 * Используется для запросов по API.
 * 
 * id обязателен
 * url обязателен
 */

import { KoiState } from "../state.js";
import { KoiProvider } from "./provider.js";

export const KoiAPILoadable = Sup => class extends Sup {

	_convertLoadResponseStatusToStateCode(response_status){
		if(response_status == 0){
			// Нет доступа к серверу
			return KoiState.getBadConnectionCode();
		}
		if(response_status == 400){
			// Ошибка авторизации
			return KoiState.getForbiddenCode();
		}
		if(response_status == 401){
			// Invalid authentication credentials - 401
			// ошибка авторизации (переданный токен устарел или заблокирован)
			// заранее изменим состояние компонента
			// NOTE - Если токен устарел, контрол (например, список) отобразит "Not Authorized"
			// в то же время в шапке будет все еще отображаеться, что все в порядке, пользователь
			// залогинен. Это сбивает с толку. Поэтому все модели-наследники, кроме model_user,
			// должны просить пользователя заново авторизоваться.
			return KoiState.getErrorCode();
		}
		if(response_status == 403){
			// Ошибка авторизации
			return KoiState.getForbiddenCode();
		}
		if(response_status == 404){
			// Bad URL - 404
			// Путь указан не правильно.
			return KoiState.getErrorCode();
		}
		if(response_status == 422){
			// Ошибка авторизации (пароль или логин не подходят)
			// TODO - Сделать дополнительный статус для оповещения, что именно в логине (или пароле) все дело.
			// TODO - Еще мы сюда попадаем, когда при загрузке данных передаем неправильные значения переменных в request. И тогда это уже не forbidden, а inaccessible.
			return KoiState.getErrorCode();
		}
		return KoiState.getBadConnectionCode();
	}

	convertLoadAPIDataToModelData(api_data){
		return api_data;
	}

	applyLoadAPIDataToModelData(new_values){
		// Here should be something like this.data.setValues(new_values);
	}

	onLoadAPISuccess(success_data){
		this._log('attemptLoadAPI() - response=success');
		// let success_data = await this.convertLoadAPIResponseIntoData(response);
		let new_values = this.convertLoadAPIDataToModelData(success_data);
		this.applyLoadAPIDataToModelData(new_values);
		this._setStateCode(KoiState.getReadyCode());
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
	}

	applyLoadAPIErrorState(response_status, error_data){
		let prev_state = this.getStateCode();
		let new_state = this._convertLoadResponseStatusToStateCode(response_status);
		if(prev_state == new_state){
			return;
		}
		this._setStateCode(new_state);
	}

	isLoadAPIErrorLoggingNeeded(response_status){
		return true;
	}

	clearModelDataOnLoadError(error_data){
		
	}

	onLoadAPIError({status, error_data}){
		this._log('attemptLoadAPI() - response=failure, code=' + status);
		this.applyLoadAPIErrorState(status, error_data);
		this.clearModelDataOnLoadError(error_data);
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
		if(!this.isLoadAPIErrorLoggingNeeded(status)){
			return;
		}
		let str_error = 'Server rejected query! ' + 
			this._load_url +
			' Status: ' + status +
			' Message: ' + (error_data.message ? error_data.message : error_data.error);
		console.error(str_error);
	}

	async convertLoadAPIResponseIntoData(response){
		return await response.json();
	}

	async _onLoadAPIFetchSuccessSuccess(success_response){
		let success_data = await this.convertLoadAPIResponseIntoData(success_response);
		this.onLoadAPISuccess(success_data);
	}

	async onLoadAPIFetchSuccessError(success_response){
		let error_data = await this.convertLoadAPIResponseIntoData(success_response);
		this.onLoadAPIError({
			status: success_response.status, 
			error_data: error_data
		});
	}

	_onLoadAPIFetchSuccess(success_response){
		if(!success_response.ok){
			this.onLoadAPIFetchSuccessError(success_response);
			return;
		}
		this._onLoadAPIFetchSuccessSuccess(success_response);
	}

	_onLoadAPIFetchError(error){
		const status = (error && typeof error.status === 'number') ? error.status : 500;
		this.onLoadAPIError({
			status,
			error_data: {
				message: error.message
			}
		});
	}

	loadAPI(load_url, load_params) {
		fetch(load_url, load_params)
			.then(response => this._onLoadAPIFetchSuccess(response))
			.catch(error => this._onLoadAPIFetchError(error));
	}

	getQueryLoadURL(filter_data){
		return this._load_url;
	}

	_getQueryLoadParams({method, token, filter_data}){
		let params = {
			method: method,
			// mode: 'no-cors', // XXX - При этом включенном параметре не хочет авторизовать
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Accept': 'application/json'
			},
			redirect: 'manual',
			referrerPolicy: 'no-referrer'
		};
		if(token){
			params.headers['Authorization'] = 'Bearer ' + token;
		}
		if(filter_data && (method != 'GET')){
			params['body'] = JSON.stringify(filter_data);
		}
		return params;
	}

	getQueryLoadParams(filter_data){
		return this._getQueryLoadParams({
			method: 'GET',
			filter_data
		});
	}

	_updateStateCodeWhenChanged(){
		// Sometimes attempt* methods change state
		// directly. In such cases we should keep
		// the code they want.
		if(this._state.isChanged()){
			return;
		}
		super._updateStateCodeWhenChanged();
	}

	attemptLoadAPI(filter_data){
		this._log('attemptLoadAPI()');
		this._setStateCode(KoiState.getLoadingCode());
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
		this.loadAPI(
			this.getQueryLoadURL(filter_data),
			this.getQueryLoadParams(filter_data)
		);
	}

	_prepareLoadURLFromAttributes(){
		this._load_url = this.getRequiredAttribute('load_url');
	}

	_onConstructed(){
		super._onConstructed();
		this._prepareLoadURLFromAttributes();
	}

}

export const KoiAPISaveable = Sup => class extends Sup {

	convertSaveAPIDataToModelData(api_data){
		return api_data;
	}

	_convertSaveResponseStatusToStateCode(response_status){
		if(response_status == 0){
			// Нет доступа к серверу
			return KoiState.getBadConnectionCode();
		}
		if(response_status == 400){
			// Ошибка авторизации
			return KoiState.getForbiddenCode();
		}
		if(response_status == 401){
			// Invalid authentication credentials - 401
			// ошибка авторизации (переданный токен устарел или заблокирован)
			// заранее изменим состояние компонента
			// NOTE - Если токен устарел, контрол (например, список) отобразит "Not Authorized"
			// в то же время в шапке будет все еще отображаеться, что все в порядке, пользователь
			// залогинен. Это сбивает с толку. Поэтому все модели-наследники, кроме model_user,
			// должны просить пользователя заново авторизоваться.
			return KoiState.getErrorCode();
		}
		if(response_status == 403){
			// Ошибка авторизации
			return KoiState.getForbiddenCode();
		}
		if(response_status == 404){
			// Bad URL - 404
			// Путь указан не правильно.
			return KoiState.getErrorCode();
		}
		if(response_status == 422){
			// Ошибка авторизации (пароль или логин не подходят)
			// TODO - Сделать дополнительный статус для оповещения, что именно в логине (или пароле) все дело.
			// TODO - Еще мы сюда попадаем, когда при загрузке данных передаем неправильные значения переменных в request. И тогда это уже не forbidden, а inaccessible.
			return KoiState.getErrorCode();
		}
		return KoiState.getBadConnectionCode();
	}

	_updateStateCodeWhenChanged(){
		// Sometimes attempt* methods change state
		// directly. In such cases we should keep
		// the code they want.
		if(this._state.isChanged()){
			return;
		}
		super._updateStateCodeWhenChanged();
	}

	applySaveAPIDataToModelData(new_values){
		// Here should be something like this.data.setValues(new_values);
	}

	onSaveAPISuccess(success_data){
		this._log('attemptSaveAPI() - response=success');
		let new_values = this.convertSaveAPIDataToModelData(success_data);
		this.applySaveAPIDataToModelData(new_values);
		this._setStateCode(KoiState.getReadyCode());
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
	}

	applySaveAPIErrorData(error_data){
		this._state.setError(error_data);
	}

	applySaveAPIErrorState(response_status, error_data){
		let prev_state = this.getStateCode();
		let new_state = this._convertSaveResponseStatusToStateCode(response_status);
		if(prev_state == new_state){
			return;
		}
		this._setStateCode(new_state);
	}

	isSaveAPIErrorLoggingNeeded(response_status){
		return true;
	}

	onSaveAPIError({status, error_data}){
		this._log('attemptLoadAPI() - response=failure, code=' + status);
		this.applySaveAPIErrorState(status, error_data);
		this.applySaveAPIErrorData(error_data);
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
		if(!this.isSaveAPIErrorLoggingNeeded(status)){
			return;
		}
		console.log(error_data);
		let str_error = 'Server rejected query! ' + this._save_url;
		console.error(str_error);
	}

	async convertSaveAPIResponseIntoData(response){
		const contentType = response.headers.get("content-type") || "";
		if (!contentType.includes("application/json")) {
			return "Expected JSON but got \n" + (await response.text());
		}
		return await response.json();
	}

	async _onSaveAPIFetchSuccessSuccess(success_response){
		let success_data = await this.convertSaveAPIResponseIntoData(success_response);
		this.onSaveAPISuccess(success_data);
	}

	async _onSaveAPIFetchSuccessError(success_response){
		let error_data = await this.convertSaveAPIResponseIntoData(success_response);
		this.onSaveAPIError({
			status: success_response.status, 
			error_data: error_data
		});
	}

	_onSaveAPIFetchSuccess(success_response){
		if(!success_response.ok){
			this._onSaveAPIFetchSuccessError(success_response);
			return;
		}
		this._onSaveAPIFetchSuccessSuccess(success_response);
	}

	_onSaveAPIFetchError(error){
		this.onSaveAPIError({
			status: 500,
			error_data: {
				message: error.message
			}
		});
	}

	saveAPI(save_url, save_params) {
		fetch(save_url, save_params)
			.then(success_response => this._onSaveAPIFetchSuccess(success_response))
			.catch(error =>this._onSaveAPIFetchError(error));
	}

	getQuerySaveURL(new_data){
		return this._save_url;
	}

	_getQuerySaveParams({method, token, new_values}){
		let params = {
			method: method,
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Accept': 'application/json'
			},
			redirect: 'manual',
			referrerPolicy: 'no-referrer'
		};
		if(token){
			params.headers['Authorization'] = 'Bearer ' + token;
		}
		if(new_values){
			params['body'] = JSON.stringify(new_values);
		}
		return params;
	}

	getQuerySaveParams(new_values){
		return this._getQuerySaveParams({
			method: 'POST', 
			new_values
		});
	}

	isStateLoading(){
		return this._state.isLoading();
	}

	_updadeOwnDataBeforeSaveAPI(new_data){

	}

	attemptSaveAPI(new_data){
		this._log('attemptSaveAPI()');
		if(this.isStateLoading()){
			return;
		}
		this._setStateCode(KoiState.getLoadingCode());
		this._updadeOwnDataBeforeSaveAPI(new_data);
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
		this.saveAPI(this.getQuerySaveURL(new_data), this.getQuerySaveParams(new_data));
	}

	_prepareSaveURLFromAttributes(){
		this._save_url = this.getRequiredAttribute('save_url');
	}

	_onConstructed(){
		super._onConstructed();
		this._prepareSaveURLFromAttributes();
	}

}

export const KoiAPIDeletable = Sup => class extends Sup {

	convertDeleteAPIDataToModelData(api_data){
		return api_data;
	}

	_convertDeleteResponseStatusToStateCode(response_status){
		if(response_status == 0){
			// Нет доступа к серверу
			return KoiState.getBadConnectionCode();
		}
		if(response_status == 400){
			// Ошибка авторизации
			return KoiState.getForbiddenCode();
		}
		if(response_status == 401){
			// Invalid authentication credentials - 401
			// ошибка авторизации (переданный токен устарел или заблокирован)
			// заранее изменим состояние компонента
			// NOTE - Если токен устарел, контрол (например, список) отобразит "Not Authorized"
			// в то же время в шапке будет все еще отображаеться, что все в порядке, пользователь
			// залогинен. Это сбивает с толку. Поэтому все модели-наследники, кроме model_user,
			// должны просить пользователя заново авторизоваться.
			return KoiState.getErrorCode();
		}
		if(response_status == 403){
			// Ошибка авторизации
			return KoiState.getForbiddenCode();
		}
		if(response_status == 404){
			// Bad URL - 404
			// Путь указан не правильно.
			return KoiState.getErrorCode();
		}
		if(response_status == 422){
			// Ошибка авторизации (пароль или логин не подходят)
			// TODO - Сделать дополнительный статус для оповещения, что именно в логине (или пароле) все дело.
			// TODO - Еще мы сюда попадаем, когда при загрузке данных передаем неправильные значения переменных в request. И тогда это уже не forbidden, а inaccessible.
			return KoiState.getErrorCode();
		}
		return KoiState.getBadConnectionCode();
	}

	applyDeleteAPIDataToModelData(new_values){
		// Here should be something like this.data.setValues(new_values);
	}

	onDeleteAPISuccess(success_data){
		this._log('attemptDeleteAPI() - response=success');
		let new_values = this.convertDeleteAPIDataToModelData(success_data);
		this.applyDeleteAPIDataToModelData(new_values);
		this._setStateCode(KoiState.getReadyCode());
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
	}

	applyDeleteAPIErrorData(error_data){
		this._state.setError(error_data);
	}

	applyDeleteAPIErrorState(response_status){
		let prev_state = this.getStateCode();
		let new_state = this._convertDeleteResponseStatusToStateCode(response_status);
		if(prev_state == new_state){
			return;
		}
		this._setStateCode(new_state);
	}

	isDeleteAPIErrorLoggingNeeded(response_status){
		return true;
	}

	onDeleteAPIError({status, error_data}){
		this._log('attemptDeleteAPI() - response=failure, code=' + status);
		this.applyDeleteAPIErrorState(status);
		this.applyDeleteAPIErrorData(error_data);
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
		if(!this.isDeleteAPIErrorLoggingNeeded(status)){
			return;
		}
		console.log(error_data);
		let str_error = 'Server rejected query! ' + this._save_url;
		console.error(str_error);
	}

	async convertDeleteAPIResponseIntoData(response){
		const contentType = response.headers.get("content-type") || "";
		if (!contentType.includes("application/json")) {
			return "Expected JSON but got \n" + (await response.text());
		}
		return await response.json();
	}

	async _onDeleteAPIFetchSuccessSuccess(success_response){
		let success_data = await this.convertDeleteAPIResponseIntoData(success_response);
		this.onDeleteAPISuccess(success_data);
	}

	async _onDeleteAPIFetchSuccessError(success_response){
		let error_data = await this.convertDeleteAPIResponseIntoData(success_response);
		this.onDeleteAPIError({
			status: success_response.status, 
			error_data: error_data
		});
	}

	_onDeleteAPIFetchSuccess(success_response){
		if(!success_response.ok){
			this._onDeleteAPIFetchSuccessError(success_response);
			return;
		}
		this._onDeleteAPIFetchSuccessSuccess(success_response);
	}

	_onDeleteAPIFetchError(error){
		this.onDeleteAPIError({
			status: 500,
			error_data: {
				message: error.message
			}
		});
	}

	deleteAPI(save_url, save_params) {
		fetch(save_url, save_params)
			.then(success_response => this._onDeleteAPIFetchSuccess(success_response))
			.catch(error =>this._onDeleteAPIFetchError(error));
	}

	getQueryDeleteURL(new_data){
		return this._save_url;
	}

	_getQueryDeleteParams({method, token, new_values}){
		let params = {
			method: method,
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Accept': 'application/json'
			},
			redirect: 'manual',
			referrerPolicy: 'no-referrer'
		};
		if(token){
			params.headers['Authorization'] = 'Bearer ' + token;
		}
		if(new_values){
			params['body'] = JSON.stringify(new_values);
		}
		return params;
	}

	getQueryDeleteParams(new_values){
		return this._getQueryDeleteParams({
			method: 'POST', 
			new_values
		});
	}

	isStateLoading(){
		return this._state.isLoading();
	}

	_updadeOwnDataBeforeDeleteAPI(new_data){
		
	}

	attemptDeleteAPI(new_data){
		this._log('attemptDeleteAPI()');
		if(this.isStateLoading()){
			return;
		}
		this._setStateCode(KoiState.getLoadingCode());
		this._updadeOwnDataBeforeDeleteAPI(new_data);
		this._updateSomethingWhenChanged();
		this._onAfterChanged();
		this.deleteAPI(this.getQueryDeleteURL(new_data), this.getQueryDeleteParams(new_data));
	}

	_prepareDeleteURLFromAttributes(){
		this._save_url = this.getRequiredAttribute('save_url');
	}

	_onConstructed(){
		super._onConstructed();
		this._prepareDeleteURLFromAttributes();
	}

}

export class KoiAPIProvider extends KoiAPILoadable(
	KoiProvider
) {

}

export const KoiAPISelfLoadable = Sup => class extends Sup {

	_onConnected(){
		super._onConnected();
		this.attemptLoadAPI({});
	}

}

export class KoiAPIProviderSelfLoading extends KoiAPISelfLoadable(
	KoiAPIProvider
) {

}
