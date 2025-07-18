# Руководство по созданию документации

Этот файл описывает стандарты и правила для документирования UI-компонентов библиотеки и проекта.

## 1. Структура файлов

-   Документация должна находиться в папке `docs` внутри соответствующей библиотеки (`web-components-lib`) или модуля (`blogger`).
-   Структура папок внутри `docs` должна полностью повторять структуру исходных файлов. Например, документация для `.../controls/buttons/SomeButton.js` должна лежать в `.../docs/controls/buttons/SomeButton.md`.
-   В каждой папке `docs` должен быть файл `index.md`, который служит оглавлением.

### Файл `index.md`

`index.md` должен содержать:
-   Список задокументированных компонентов.
-   Краткое (в одно предложение) описание назначения каждого компонента.
-   Ссылку на детальную страницу документации компонента.

**Пример:**
```markdown
### Buttons

*   **MyButton**: [документация](./controls/buttons/MyButton.md)
    *   Кнопка для выполнения основного действия на форме.
```

## 2. Принцип самодостаточности

-   Каждый файл документации должен быть **самодостаточным**.
-   Нельзя просто ссылаться на документацию родительского класса для описания ключевой функциональности. Если компонент наследует публичные методы, свойства или события, которые важны для его использования, их **необходимо описать заново** в документации дочернего компонента.
-   Цель — избавить пользователя от необходимости "прыгать" по файлам, чтобы понять, как использовать компонент.

## 3. Структура файла документации компонента

Каждый файл `.md` для компонента должен иметь следующую структуру:

---

### `# ИмяКомпонента`
Краткое и ясное описание назначения компонента.

`**Наследует:** ParentComponent -> GrandParentComponent`

---

### `## Создание компонента`
-   Описать статический метод `getTag()` (если есть) или основной способ создания/использования компонента в HTML.
-   Привести примеры использования в JS и/или HTML.
-   Создать список всех параметров метода `getTag()` с указанием их типа, обязательности и назначения.

---

### `## Объект данных`
-   Указать, какой класс данных использует компонент (например, `KoiButtonData`).
-   Перечислить ключевые свойства, которые хранятся в этом объекте данных.

---

### `## Методы управления`
-   Перечислить **все публичные методы**, доступные на экземпляре компонента.
-   Для каждого метода указать его назначение и параметры.
-   Если метод добавлен или переопределен в текущем классе, это можно отметить (например, `**(Добавлено)**`).
-   Привести краткий пример использования.

---

### `## События`
-   Описать, какие кастомные события генерирует компонент (например, `koi-operated`).
-   Объяснить, как перехватить это событие: какой миксин (`KoiOperationsInterceptable`) и какие методы (`_getInterceptableOperateEventCode`, `_handleOperated`) нужно использовать.
-   Предоставить полноценный пример кода для компонента-слушателя.

## 4. Дополнительные правила и рекомендации

-   **Ссылки на исходный код:** Если в документации упоминается ключевая сущность фреймворка (например, миксин или базовый класс), следует давать на нее относительную ссылку в формате `[имя сущности](./путь/к/файлу.js)`. Это упрощает навигацию.
-   **Уточнение необязательных методов:** Если какой-либо метод (например, метод для перехвата события) является необязательным к реализации и имеет поведение по умолчанию, это необходимо явно указать в док��ментации. Следует описать, какое поведение будет использовано, если метод не переопределен.
