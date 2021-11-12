import EditorJS, { API, BlockAPI, EditorConfig, LogLevels, OutputData } from "@editorjs/editorjs";

const Header = require("@editorjs/header");
const Paragraph = require("@editorjs/paragraph");
const List = require("@editorjs/list");
const Quote = require("@editorjs/quote");
const Warning = require("@editorjs/warning");
const Marker = require("@editorjs/marker");
const InlineCode = require("@editorjs/inline-code");
const ImageBlock = require("@editorjs/image");
const Delimiter = require("@editorjs/delimiter");
const Table = require("@editorjs/table");
const AttachesTool = require("@editorjs/attaches");

export const EditorJSCoreToolConfiguration = {
    tools: {
        paragraph: {
            class: Paragraph,
            inlineToolbar: [ "bold", "italic", "link" ],
        }
    }
};

export const EditorJSToolConfiguration = {
    tools: {
        attaches: {
            class: AttachesTool,
            config: {
                uploader: {
                    "uploadByFile": async (file: any) =>
                    {
                        console.log(file);
                    }
                }
            }
        },

        header: {
            class: Header,
            config: {
                levels: [ 1, 2 ],
                defaultLevel: 1,
                placeholder: "Введите заголовок"
            }
        },

        table: {
            class: Table,
            inlineToolbar: [ "bold", "italic", "link", "marker", "inlineCode" ]
        },

        image: {
            class: ImageBlock,
            config: {
                captionPlaceholder: "Подпись к изображению",
                uploader: {}
            }
        },

        delimiter: Delimiter,
        marker: Marker,
        inlineCode: InlineCode,

        paragraph: {
            class: Paragraph,
            inlineToolbar: [ "bold", "italic", "link", "marker", "inlineCode" ],
            preserveBlank: true
        },

        list: List,
        quote: {
            class: Quote,
            config: {
                quotePlaceholder: "Цитата",
                captionPlaceholder: "Подпись"
            }
        },

        warning: {
            class: Warning,
            config: {
                titlePlaceholder: "Название",
                messagePlaceholder: "Сообщение"
            }
        }
    }
};

export const EditorJSLocalizationConfiguration = {
    i18n: {
        messages: {
            ui: {
                blockTunes: {
                    toggler: {
                        "Click to tune": "Настроить блок",
                        Delete: "Удалить"
                    }
                },
                inlineToolbar: {
                    converter: {
                        "Convert to": "Конвертировать"
                    }
                },
                toolbar: {
                    toolbox: {
                        Add: "Добавить"
                    }
                }
            },
            toolNames: {
                Text: "Параграф",
                Image: "Картинка",
                Heading: "Заголовок",
                List: "Список",
                Warning: "Примечание",
                Quote: "Цитата",
                Code: "Код",
                Delimiter: "Разделитель",
                "Raw HTML": "HTML-фрагмент",
                Table: "Таблица",
                Link: "Ссылка",
                Marker: "Маркер",
                Bold: "Полужирный",
                Italic: "Курсив",
                InlineCode: "Моноширинный"
            },
            tools: {
                link: {
                    "Add a link": "Вставьте ссылку"
                },
                list: {
                    Ordered: "Нумерованный",
                    Unordered: "Маркированный"
                },
                image: {
                    "Select an Image": "Загрузить изображение"
                }
            },
            blockTunes: {
                delete: {
                    Delete: "Удалить"
                },
                moveUp: {
                    "Move up": "Переместить вверх"
                },
                moveDown: {
                    "Move down": "Переместить вниз"
                }
            }
        }
    }
};

interface EditorInstanceProps
{
    onReady: () => void;
    onImageLoaded: (image: File) => void;

    onChange: (api: API, block: BlockAPI) => void;
    configuration: { [key: string]: any }
}

export default class EditorInstance
{
    private editorInstance?: EditorJS;

    private readonly editorConfig: EditorConfig = {
        logLevel: "ERROR" as LogLevels,

        // placeholder: "Напишите что-нибудь...",

        holder: "editorjs-holder",
        autofocus: true,

        inlineToolbar: [ "bold", "italic", "link", "marker", "inlineCode" ]
    };

    constructor (props: Partial<EditorInstanceProps>, content?: OutputData)
    {
        const configuration = props.configuration;

        this.editorConfig = { ...this.editorConfig, ...configuration };
        if (content) this.editorConfig.data = content;

        if (props && props.onChange) this.editorConfig.onChange = props.onChange;
        if (props && props.onReady) this.editorConfig.onReady = props.onReady;
    }

    public createInstance (holder: string = "editorjs-holder")
    {
        if (!this.editorInstance)
        {
            if (holder) this.editorConfig.holder = holder;
            this.editorInstance = new EditorJS(this.editorConfig);
        }

        return this.editorInstance;
    }
}
