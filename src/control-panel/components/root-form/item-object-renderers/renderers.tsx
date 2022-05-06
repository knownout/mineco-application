/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import { DataProp } from "editorjs-blocks-react-renderer";
import React from "react";
import classNames from "../../../../lib/class-names";
import convertDate from "../../../../lib/convert-date";
import { serverRoutesList } from "../../../../lib/routes-list";
import { setWordsLimit } from "../../../../lib/words-limit";

/**
 * Namespace for the items that renders in the items list
 * panel (files, materials, maybe something else)
 *
 * @internal
 */
export namespace ItemObject
{
    /**
     * Interface for the file item
     */
    export interface File
    {
        identifier: string;
        filename: string;
        datetime: string;
    }

    /**
     * Interface for the material item
     */
    export interface Material
    {
        identifier: string;
        title: string;
        description: string;
        tags: string;
        datetime: string;
        preview: string;
        pinned: string;
        background?: string;
    }

    export interface FullMaterial
    {
        data: Material,
        content: DataProp
    }

    export interface ProcessedMaterial extends Omit<Material, "tags" | "pinned" | "attachments">
    {
        tags: string[];
        pinned: boolean;
    }

    export interface Variable<T = unknown>
    {
        identifier: string,
        name: string;
        value: T;
    }

    /** United type of the Material and File interfaces */
    export type Unknown = Partial<Material & File>;

    /** Possible item types */
    export enum Type
    {
        materials,
        files,
        variables
    }
}

interface CommonRendererProps
{
    selected: boolean;

    onClick? (event: React.MouseEvent<HTMLElement>): void;
}

/**
 * Renderer for the material item object
 * @internal
 *
 * @constructor
 */
export function MaterialRenderer (renderer: ItemObject.Material & CommonRendererProps) {
    const date = new Date(parseInt(renderer.datetime) * 1000);
    const rootClassName = classNames("material-object ui flex column gap padding-20", {
        selected: renderer.selected,
        future: date.getTime() > Date.now()
    });

    const descriptionString = setWordsLimit(renderer.description);

    return <div className={ rootClassName } onClick={ renderer.onClick }>
        <div className="material-header ui flex row center-ai gap">
            <img src={ serverRoutesList.getFile(renderer.preview, false) } alt={ renderer.title }
                 className="preview-image" />

            <span className="material-title">{ renderer.title }</span>
        </div>

        <div className="material-description ui fz-14 opacity-75">{ descriptionString }</div>
        <div className="material-additional-data ui fz-12 opacity-50 flex column">
            <span className="date">{ convertDate(date) }</span>
            <span className="identifier">#{ renderer.identifier }</span>
        </div>
    </div>;
}

/**
 * Renderer for the file item object
 * @internal
 *
 * @constructor
 */
export function FileRenderer (renderer: ItemObject.File & CommonRendererProps & { filter?: string[] }) {
    // Split filename with dot
    const fileNameArray = renderer.filename.split(".");

    // Separate file name and extension
    const fileName = {
        name: fileNameArray.slice(0, -1).join(".").replace(/@\d{6}-\d{6}/g, ""),
        extension: fileNameArray.slice(-1)[0]
    };

    const rootClassName = classNames("file-object ui flex row gap padding-20 center-ai", {
        selected: renderer.selected
    });

    if (renderer.filename.slice(0, 9) == "_default-") return null;
    if (renderer.filter && !renderer.filter.includes(renderer.filename.split(".").slice(-1)[0].toLowerCase()))
        return null;

    const name = fileName.name.split("/").slice(1).join("/").replace(/@\d{6}-\d{6}/g, "");

    const canRenderPreview = [ "png", "jpg", "jpeg" ]
        .includes(String(renderer.filename.split(".").pop()).toLocaleLowerCase());

    return <a className={ rootClassName } onClick={ event => {
        event.preventDefault();
        renderer.onClick && renderer.onClick(event);
    } } href={ serverRoutesList.getFile(renderer.filename, false) }>
        { canRenderPreview && <span className="preview-image-wrapper ui">
                <img src={ serverRoutesList.getFile(renderer.filename, false) }
                     alt="" className="preview-image" />
            </span> }

        <div className="wrapper ui flex column">
            <div className="file-header ui word-break-all flex row wrap center-ai gap-5">
            <span className="extension-badge ui badge opacity-65 fz-14 lh-22">
                { fileName.extension.toLowerCase() }
            </span>
                { name.length > 0 ? name : fileName.name }
            </div>

            <div className="file-additional-data ui fz-12 opacity-50 flex row wrap gap-5">
                <span className="date">#{ renderer.identifier } { convertDate(
                    new Date(parseInt(renderer.datetime) * 1000)) }</span>
            </div>
        </div>
    </a>;
}

export function VariableRenderer (renderer: ItemObject.Variable & CommonRendererProps) {
    const rootClassName = classNames("variable-object ui flex column gap-5 padding-20", {
        selected: renderer.selected
    });

    return <div className={ rootClassName } onClick={ renderer.onClick }>
        <span className="variable-name ui opacity-95 word-break-all">
            { renderer.name }
        </span>

        <div className="variable-badge-holder ui flex row">
            <span className="ui badge opacity-65 fz-12">Переменная</span>
        </div>
    </div>;
}
