import EditorJS from "@editorjs/editorjs";

const header = require("@editorjs/header");
const delimiter = require("@editorjs/delimiter");
const list = require("@editorjs/list");
const image = require("@editorjs/simple-image");
const table = require("@editorjs/table");
const raw = require("@editorjs/raw");

export const defaultToolsList = {
    header: {
        class: header,
        config: {
            placeholder: "Введите заголовок...",
            levels: [ 1, 2, 3 ],
            defaultLevel: 1
        }
    },
    delimiter,
    image,
    list: {
        class: list,
        inlineToolbar: true
    },

    raw: {
        class: raw,
        config: {
            placeholder: "HTML-код"
        }
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
            "List": "Список",
            "Delimiter": "Разделитель",
            "Raw HTML": "HTML-фрагмент",
            "Table": "Таблица",
            "Heading": "Заголовок",
        }
    }
} as EditorJS.I18nConfig;