import { OutputData } from "@editorjs/editorjs";

const header = require("@editorjs/header");
const delimiter = require("@editorjs/delimiter");
const list = require("@editorjs/list");
const image = require("@editorjs/image");

export interface EditorCore {
    destroy (): Promise<void>;

    clear (): Promise<void>;

    save (): Promise<OutputData>;

    render (data: OutputData): Promise<void>;
}

export const defaultToolsList = { header, delimiter, list, image };