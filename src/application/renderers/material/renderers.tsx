/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import { RenderFn } from "editorjs-blocks-react-renderer";
import Table from "editorjs-blocks-react-renderer/dist/renderers/table";
import Image from "editorjs-blocks-react-renderer/dist/renderers/image";

import HTMLReactParser from "html-react-parser";
import React from "react";
import classNames from "../../../lib/class-names";

const TableRenderer: RenderFn<{ withHeadings?: boolean; content: string[][] }> = props => {
    return <div className={ classNames("table-wrapper",
        { "hide-border": props.data.withHeadings && props.data.content.length == 1 }) }>
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

const RawHTMLRenderer: RenderFn<{ html: string }> = props => {
    return <>
        <div className="unsafe_rawhtml-box ui grid center w-100 margin clean"
             dangerouslySetInnerHTML={ { __html: props.data.html } } />
    </>;
};

const ParagraphRenderer: RenderFn<{ text: string  }> = props => {

    return <>
    <div dangerouslySetInnerHTML={ { __html: props.data.text.replace(/(?<=<a.*)href="(.*)"(?=.*>)/g, (href) => {
        if (/(http(s?):\/\/).*(#)/g.test(href)) return href.slice(0, -2) + '"' + ' target="_blank" rel="noreferrer"'

    return href
})}}/>
        </>
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

const CarouselRenderer: RenderFn<{ files: string[] }> = props => {
    const [ current, setCurrent ] = React.useState(0);

    const onButtonClick = (reverse: boolean) => {
        if (reverse) setCurrent(current => current == 0 ? props.data.files.length - 1 : current - 1);
        else setCurrent(current => current == props.data.files.length - 1 ? 0 : current + 1);
    };

    return <div className="carousel editor-block ui flex row no-wrap">
        <div className="arrow left ui grid center" onClick={ () => onButtonClick(true) }>
            <i className="bi bi-caret-left-fill" />
        </div>
        <div className="display-layer ui flex row">
            <div className="wrapper ui flex row" style={ { transform: `translateX(-${ 100 * current }%)` } }>
                { props.data.files.map((file, index) =>
                    <img src={ file } alt="" key={ index } />) }
            </div>
        </div>
        <div className="arrow right ui grid center margin-left-auto" onClick={ () => onButtonClick(false) }>
            <i className="bi bi-caret-right-fill" />
        </div>
    </div>;
};

const ImageRenderer: RenderFn<{ caption: string, file: { url: string } }> = props => {
    props.data.file.url = props.data.file.url
        .replace(/https?:\/\/.*\.gospmr\.org/, "")
        .replace(/https?:\/\/192\.168\.\d{1,3}\.\d{1,3}:?\d{0,5}(?=\/)/g, "");
    return Image(props as any);
};

export {
    TableRenderer,
    FileRenderer,
    WarningRenderer,
    HeaderRenderer,
    CarouselRenderer,
    RawHTMLRenderer,
    ImageRenderer,
    ParagraphRenderer
};
