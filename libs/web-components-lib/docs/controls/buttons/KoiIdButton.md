# KoiIdButton

Кнопка, которая при нажатии генерирует событие `koi-operated` и передает в нем свои атрибуты `item_id`, `item_action` и `item_value`.

**Наследует:** `KoiButtonNativeButtonSocketConnectable` -> `KoiButtonDataCapable` -> `KoiButtonStencil`

---

## Создание компонента

Для создания компонента используется статический метод `getTag()`.

```javascript
KoiIdButton.getTag({
    element_id,    // string, обязательный
    item_id,       // string | number, опциональный
    item_action,   // string, опциональный
    item_value,    // any, опциональный
    css_class,     // string, опциональный
    btn_class,     // string, опциональный
    btn_type,      // string, опциональный
    btn_enabled,   // boolean, опциональный
    placeholder,   // string, обязательный
    debug_mode     // boolean, опциональный
});
```

**Параметры `getTag()`:**

*   `element_id`: Уникальный `id` для HTML-элемента.
*   `item_id`: Идентификатор элемента, с которым связана кнопка.
*   `item_action`: Действие, которое будет передано в событии.
*   `item_value`: Дополнительное значение, которое будет передано в событии.
*   `css_class`: CSS-класс для корневого элемента компонента.
*   `btn_class`: CSS-класс для тега `<button>`. Например: `btn-primary`, `btn-link`.
*   `btn_type`: Тип кнопки. Например: `button`, `submit`.
*   `btn_enabled`: Определяет, активна ли кнопка.
*   `placeholder`: Текст или HTML-содержимое кнопки.
*   `debug_mode`: Включает режим отладки с выводом в консоль.

---

## Объект данных

Компонент использует `KoiButtonData` (`KoiOperationData`), который хранит:

*   `item_id`
*   `item_action`
*   `item_value`

Эти значения устанавливаются из атрибутов компонента при его инициализации.

---

## Методы управления

*   `disable()`: Делает кнопку неактивной.
*   `enable()`: Делает кнопку активной.
*   `showHourglass()`: Показывает спиннер загрузки внутри кнопки.
*   `hideHourglass()`: Скрывает спиннер загрузки.

---

## События

### Генерация события

При клике `KoiIdButton` генерирует событие **`koi-operated`**.

### Перехват события

Для перехвата этого события компонент-родитель должен использовать миксин `KoiOperationsInterceptable` [файл](../../../event_operated.js).

**Пример перехвата:**

```javascript
class MyParentComponent extends KoiOperationsInterceptable(KoiBaseControl) {

    // 1. Указать код перехватываемого события (необязательно)
    _getInterceptableOperateEventCode() {
        return 'koi-operated'; // значение по-умолчанию
    }

    // 2. Обработать событие
    _handleOperated(event_detail) {
        // event_detail - это объект KoiEventDetails

        // Получение данных из события
        const action = event_detail.data.getAction(); // вернет item_action
        const itemId = event_detail.data.getItemId();   // вернет item_id
        const value = event_detail.data.getValue();     // вернет item_value

        console.log(`Button clicked with action: ${action} and ID: ${itemId}`);

        // Здесь можно реализовать логику, реагирующую на нажатие кнопки.
    }
}
```
