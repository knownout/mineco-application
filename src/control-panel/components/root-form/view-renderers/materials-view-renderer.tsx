import React from "react";
import { ItemObject } from "../item-object-renderers/renderers";
import useRecaptcha from "../../../../lib/use-recaptcha";
import MakeFormData from "../../../../lib/make-form-data";
import { RequestOptions, Response } from "../../../cms-types/requests";
import { makeRoute, serverRoutesList } from "../../../../lib/routes-list";
import { CommonViewRendererProps } from "./item-objects-view";
import Input from "../../../../common/input";

import { createReactEditorJS } from "react-editor-js";

const Header = require("@editorjs/header");
const Delimiter = require("@editorjs/delimiter");
const List = require("@editorjs/list");
const Image = require("@editorjs/image");


const ReactEditorJS = createReactEditorJS();
// This renderer may be too complex, so I decided
// to move it to a separate file

interface MaterialViewRendererProps extends ItemObject.Material, CommonViewRendererProps {
    onLoadingError? (): void;
}

/**
 * Renderer for material preview and modification
 * @constructor
 */
export default function MaterialViewRenderer (props: MaterialViewRendererProps) {
    type MaterialDataResponse = { data: ItemObject.Material, content: unknown, tags: string[] }
    const [ material, setMaterial ] = React.useState<MaterialDataResponse>();

    const setLoading = (loading: boolean) => props.onLoadStateChange && props.onLoadStateChange(loading);

    React.useEffect(() => {
        setLoading(true);

        useRecaptcha().then(async token => {
            const formData = new MakeFormData({
                [RequestOptions.recaptchaToken]: token,
                [RequestOptions.getMaterial]: props.identifier
            });

            const response = await fetch(makeRoute(serverRoutesList.getMaterial), formData.fetchObject)
                .then(response => response.json()) as Response<MaterialDataResponse>;


            if (response && response.success) setMaterial(response.responseContent as MaterialDataResponse);
            else if (props.onLoadingError) props.onLoadingError();

            console.log(response);
            setLoading(false);
        });
    }, [ props.identifier ]);

    function getControlsList () {
        const materialData = material as MaterialDataResponse;
        const date = new Date(parseInt(materialData.data.datetime) * 1000);

        function formatDate (date: Date) {
            let [ month, day, year, hours, minutes ] = [
                date.getMonth() + 1, date.getDate(), date.getFullYear(), date.getHours(), date.getMinutes()
            ].map(e => String(e));

            [ month, day, hours, minutes ] = [ month, day, hours, minutes ].map(e => e.padStart(2, "0"));
            return `${ month }.${ day }.${ year } ${ hours }:${ minutes }`;
        }

        console.log(materialData);
        return <React.Fragment>
            <Input placeholder="Заголовок материала">{ materialData.data.title }</Input>
            <div className="ui flex row">
                <div className="preview-image-holder">
                    <img src={ materialData.data.preview } alt="" className="ui border-radius-10" />
                </div>
                <div className="inputs-holder ui flex column">
                    <Input placeholder="Идентификатор">{ materialData.data.identifier }</Input>
                    <Input placeholder="Дата публикации">{ formatDate(date) }</Input>
                </div>
            </div>
            <textarea className="ui w-100 interactive clean opacity-65"
                      defaultValue={ materialData.data.description } />
            <ReactEditorJS defaultValue={ materialData.content }
                           tools={ { header: Header, delimiter: Delimiter, list: List, image: Image } } />
        </React.Fragment>;
    }

    return <div className="view material-view ui grid center">
        <div className="view-content-wrapper ui flex scroll padding-20 w-100 h-100">
            { material && getControlsList() }
        </div>
    </div>;
}