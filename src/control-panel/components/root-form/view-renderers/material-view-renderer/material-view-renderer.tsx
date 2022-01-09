import React from "react";

import { RequestOptions, Response } from "../../../../cms-types/requests";

import useRecaptcha from "../../../../../lib/use-recaptcha";
import MakeFormData from "../../../../../lib/make-form-data";

import { makeRoute, serverRoutesList } from "../../../../../lib/routes-list";
import { useFullAuthentication } from "../../../../../lib/use-full-authentication";

import Input from "../../../../../common/input";
import Button from "../../../../../common/button";
import Notify from "../../../../../common/notify";

import { CommonViewRendererProps } from "../item-objects-view";
import { defaultToolsList, EditorCore } from "./editor-js-config";
import { ItemObject } from "../../item-object-renderers/renderers";

import { createReactEditorJS } from "react-editor-js";

const ReactEditorJS = createReactEditorJS();

// This renderer may be too complex, so I decided
// to move it to a separate file

/**
 * Properties list for the material view renderer
 */
interface MaterialViewRendererProps extends ItemObject.Material, CommonViewRendererProps {
    notify?: Notify;

    // Fires when material successfully deleted
    onMaterialDelete? (): void;
}

/**
 * Renderer for material preview and modification
 * @constructor
 */
export default function MaterialViewRenderer (props: MaterialViewRendererProps) {
    // Material data container
    const [ material, setMaterial ] = React.useState<MaterialDataResponse>();

    // View loading state
    const [ loading, _setLoading ] = React.useState(true);

    // Editor JS initialization
    const editorCore = React.useRef<EditorCore | null>(null);

    const handleInitialize = React.useCallback((instance: EditorCore) => {
        setLoading(true);
        editorCore.current = instance;
    }, []);

    // Type for material data server response
    type MaterialDataResponse = { data: ItemObject.Material, content: unknown, tags: string[] }

    // Shortcut for updating loading state
    const setLoading = (loading: boolean) => {
        props.onLoadStateChange && props.onLoadStateChange(loading);
        _setLoading(loading);
    };

    // Require content from the server
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
            setLoading(false);
        });
    }, [ props.identifier ]);

    // Get control menu for material view
    function getControlsList () {
        const materialData = material as MaterialDataResponse;
        const date = new Date(parseInt(materialData.data.datetime) * 1000);

        /**
         * Function for formatting date to the next format: dd.mm.YY HH:mm
         * @param date js Date object
         */
        function formatDate (date: Date) {
            let [ month, day, year, hours, minutes ] = [
                date.getMonth() + 1, date.getDate(), date.getFullYear(), date.getHours(), date.getMinutes()
            ].map(e => String(e));

            [ month, day, hours, minutes ] = [ month, day, hours, minutes ].map(e => e.padStart(2, "0"));
            return `${ month }.${ day }.${ year } ${ hours }:${ minutes }`;
        }

        return <React.Fragment>
            <div className="material-controls ui flex row border-radius-10 gap">
                <Button icon="bi bi-arrow-clockwise">Обновить</Button>
                <Button icon="bi bi-image">Изменить превью</Button>
                <Button icon="bi bi-trash-fill" onClick={ materialDeleteHandler }>Удалить</Button>
                <Button icon="bi bi-box-arrow-up-right">Открыть</Button>
            </div>
            <div className="title-and-date ui flex row margin optimize gap">
                <Input placeholder="Заголовок материала" className="title-input">{ materialData.data.title }</Input>
                <Input placeholder="Дата публикации" className="date-input">{ formatDate(date) }</Input>
            </div>
            <span className="ui opacity-75">Краткое содержание материала</span>
            <textarea className="ui clean interactive material-description"
                      placeholder="Введите краткое содержание материала"
                      defaultValue={ materialData.data.description }
            />

            <span className="ui opacity-75">Полный текст материала</span>
            <ReactEditorJS onInitialize={ handleInitialize } tools={ defaultToolsList }
                           defaultValue={ materialData.content } onReady={ () => setLoading(false) } />
        </React.Fragment>;
    }

    /**
     * Handler for deleting material on the server
     */
    async function materialDeleteHandler () {
        setLoading(true);
        const { formDataEntries } = await useFullAuthentication();

        const formData = new MakeFormData({
            ...formDataEntries,
            [RequestOptions.deleteMaterial]: props.identifier
        });

        const response = await fetch(makeRoute(serverRoutesList.deleteMaterial), formData.fetchObject)
            .then(response => response.json()) as Response<unknown>;

        if (response.success) {
            if (props.onMaterialDelete) props.onMaterialDelete();
            props.notify && props.notify.add(`Материал #${ props.identifier } успешно удален`);

        } else props.notify && props.notify.add("Не удалось удалить материал");
    }

    // Render the things that were before
    return <div className="view material-view ui grid center">
        <div className="view-content-wrapper ui flex scroll w-100 h-100 gap">
            { material && getControlsList() }
            { !material && loading && <div className="ui flex gap row w-100 h-100 center opacity-75">
                <i className="ui loading-spinner opacity-85" />
                <span>Загрузка данных материала...</span>
            </div> }
            { !material && !loading && <div className="ui flex gap column text-center w-100 h-100 center">
                <div className="ui limit-380 flex column gap-20 lh-26">
                    <span>
                        При загрузке материала произошла ошибка.
                        Попробуйте перезагрузить страницу или обратитесь к администратору
                    </span>
                    <i className="bi bi-bug-fill ui fz-48 opacity-75" />
                </div>
            </div> }
        </div>
    </div>;
}