import { RenderFn } from "editorjs-blocks-react-renderer";
import Table from "editorjs-blocks-react-renderer/dist/renderers/table";
import HTMLReactParser from "html-react-parser";
import React from "react";
import classNames from "../../../lib/class-names";

const TableRenderer: RenderFn = props => {
    return <div className="table-wrapper">
        { Table(props as any) }
    </div>;
};

const FileRenderer: RenderFn<{ title: string, file: any }> = props => {
    const getFiletypeIcon = (extension: string) => {
        switch (extension) {
            case "zip":
            case "rar":
                return "file-earmark-zip";

            case "docx":
            case "doc":
                return "file-earmark-word";

            case "pdf":
                return "file-pdf";

            default:
                return "filetype-" + extension;
        }
    };

    return <a className="file-object ui flex row center-ai w-100 clean border-radius-10 padding-20"
              href={ props.data.file.url.replace("&amp;", "\&") }
              target="_blank">
        <i className={ classNames("filetype-icon padding-20 ui bi", "bi-"
            + getFiletypeIcon(props.data.file.extension)) } />
        <div className="file-name-data ui flex column">
            <span className="file-title">{ props.data.title }</span>
            <span className="file-real-name ui fz-14 opacity-65">{ props.data.file.name }</span>
        </div>
        <i className="bi bi-download ui margin-left-auto padding-20" />
    </a>;
};

const WarningRenderer: RenderFn<{ title: string, message: string }> = props => {
    return <div className="warning ui flex column padding-20 border-radius-10">
        <div className="warning-title ui flex row gap">
            <i className="bi bi-exclamation-triangle-fill" />
            <span className="warning-title-text ui fw-700">{ props.data.title }</span>
        </div>
        <div className="message ui flex column">
            { props.data.message }
        </div>
    </div>;
};

const HeaderRenderer: RenderFn<{ text: string, level: number }> = props => {
    const plain = props.data.text.replace(/<[^>]*>/g, "")
        .replace(/&[a-z]+;/g, "")
        .replace(/\s+/g, "-")
        .toLocaleLowerCase();

    return React.createElement(`h${ props.data.level }`, { name: plain }, HTMLReactParser(props.data.text));
};

export { TableRenderer, FileRenderer, WarningRenderer, HeaderRenderer };