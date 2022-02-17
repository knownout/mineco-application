import EditorJS from "@editorjs/editorjs";

const header = require("@editorjs/header");
const delimiter = require("@editorjs/delimiter");
const list = require("@editorjs/list");

const table = require("@editorjs/table");
const raw = require("@editorjs/raw");
const paragraph = require("@editorjs/paragraph");

const checklist = require("@editorjs/checklist");
const warning = require("@editorjs/warning");
const quote = require("@editorjs/quote");
const embed = require("@editorjs/embed");

export const defaultToolsList = {
    header: {
        class: header,
        config: {
            placeholder: "Введите заголовок...",
            levels: [ 1, 2, 3 ],
            defaultLevel: 1
        },
        shortcut: "CMD+SHIFT+H"
    },
    delimiter: {
        class: delimiter,
        shortcut: "CMD+SHIFT+D"
    },

    checklist: {
        class: checklist,
        inlineToolbar: true
    },

    quote: {
        class: quote,
        inlineToolbar: true,
        config: {
            quotePlaceholder: "Введите цитату",
            captionPlaceholder: "Автор цитаты"
        },
        shortcut: "CMD+SHIFT+O"
    },
    warning,
    embed: embed,

    paragraph: {
        class: paragraph,
        inlineToolbar: true,
        config: {
            preserveBlank: true,
            placeholder: "Введите текст"
        },
        shortcut: "CMD+SHIFT+P"
    },
    list: {
        class: list,
        inlineToolbar: true
    },

    raw: {
        class: raw,
        config: {
            placeholder: "HTML-код"
        },
        shortcut: "CMD+SHIFT+R"
    },
    table: {
        class: table,
        inlineToolbar: true,
        config: {
            rows: 2,
            cols: 3
        }
    }
};

export const defaultLocalization = {
    messages: {
        blockTunes: {
            moveUp: {
                "Move up": "Переместить вверх"
            },

            moveDown: {
                "Move down": "Переместить вниз"
            },

            delete: {
                "Delete": "Удалить"
            }
        },

        toolNames: {
            "Text": "Параграф",
            "Heading": "Заголовок",
            "List": "Список",
            "Warning": "Примечание",
            "Checklist": "Чеклист",
            "Quote": "Цитата",
            "Code": "Код",
            "Delimiter": "Разделитель",
            "Raw HTML": "HTML-фрагмент",
            "Table": "Таблица",
            "Link": "Ссылка",
            "Marker": "Маркер",
            "Bold": "Полужирный",
            "Italic": "Курсив",
            "InlineCode": "Моноширинный",
            "Image": "Картинка"
        },

        ui: {
            blockTunes: {
                toggler: {
                    "Click to tune": "Нажмите, чтобы настроить",
                    "or drag to move": "или перетащите"
                }
            },
            inlineToolbar: {
                converter: {
                    "Convert to": "Конвертировать в"
                }
            },
            toolbar: {
                toolbox: {
                    "Add": "Добавить"
                }
            }
        },

        tool: {
            "link": {
                "Add a link": "Вставьте ссылку"
            },
            "header": {
                "Header": "Заголовок"
            },
            "paragraph": {
                "Enter something": "Введите текст"
            },
            "list": {
                "Ordered": "Нумерованный",
                "Unordered": "Маркированный"
            },
            "stub": {
                "The block can not be displayed correctly.": "Блок не может быть отображен"
            },
            "image": {
                "Caption": "Подпись",
                "Select an Image": "Выберите файл",
                "With border": "Добавить рамку",
                "Stretch image": "Растянуть",
                "With background": "Добавить подложку"
            },
            "code": {
                "Enter a code": "Код"
            },
            "warning": { // <-- 'Warning' tool will accept this dictionary section
                "Title": "Название",
                "Message": "Сообщение"
            }
        }
    }
} as EditorJS.I18nConfig;