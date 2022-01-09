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
import CheckBox from "../../../../../common/checkbox/checkbox";
import classNames from "../../../../../lib/class-names";
import FileSelect from "../file-select";

const ReactEditorJS = createReactEditorJS();

// This renderer may be too complex, so I decided
// to move it to a separate file

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

/**
 * Type for material data server response
 */
type MaterialDataResponse = { data: ItemObject.Material, content: unknown, tags: string[] }

/**
 * Properties list for the material view renderer
 */
interface MaterialViewRendererProps extends ItemObject.Material, CommonViewRendererProps {
    notify?: Notify;

    // Fires when material successfully deleted
    onMaterialDelete? (): void;

    onMaterialUpdate? (): void;
}

/**
 * Renderer for material preview and modification
 * @constructor
 */
export default function MaterialViewRenderer (props: MaterialViewRendererProps) {
    // Material data container
    const [ material, setMaterial ] = React.useState<MaterialDataResponse>();
    const [ dateInputError, setDateInputError ] = React.useState(false);

    const [ fileSelectDisplay, setFileSelectDisplay ] = React.useState(false);
    const fileSelectCallback = React.useRef<((file?: string) => void) | null>(null);

    // View loading state
    const [ loading, _setLoading ] = React.useState(true);

    // Editor JS initialization
    const editorCore = React.useRef<EditorCore | null>(null);

    const [ materialProps, _setMaterialProps ] = React.useState<ItemObject.ProcessedMaterial>({
        pinned: props.pinned === "1",
        tags: props.tags.split(",").map(e => e.trim()).filter(e => e.length > 0),
        identifier: props.identifier,
        preview: props.preview,
        description: props.description,
        title: props.title,
        datetime: formatDate(new Date(parseInt(props.datetime) * 1000))
    });

    const setMaterialProps = (props: Partial<ItemObject.ProcessedMaterial>) =>
        _setMaterialProps(Object.assign({}, materialProps, props));

    const handleInitialize = React.useCallback((instance: EditorCore) => {
        setLoading(true);
        editorCore.current = instance;
    }, []);

    // Shortcut for updating loading state
    const setLoading = (loading: boolean) => {
        props.onLoadStateChange && props.onLoadStateChange(loading);
        _setLoading(loading);
    };

    // Require content from the server
    React.useEffect(() => {
        setLoading(true);
        setMaterial(undefined);

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

    /**
     * Get control menu for material view
     */
    function getControlsList () {
        const materialData = material as MaterialDataResponse;
        const dateInputHandler = (value: string) => {
            const dateObject = new Date(value);
            if (isNaN(dateObject.getTime())) setDateInputError(true);
            else {
                setMaterialProps({ datetime: value });
                setDateInputError(false);
            }
        };

        return <React.Fragment>
            <div className="material-controls ui flex row border-radius-10 gap">
                <Button icon="bi bi-arrow-clockwise" onClick={ materialUpdateHandler }>Обновить</Button>
                <Button icon="bi bi-image" onClick={ previewChangeHandler }>Изменить превью</Button>
                <Button icon="bi bi-trash-fill" onClick={ materialDeleteHandler }>Удалить</Button>
                <Button icon="bi bi-box-arrow-up-right">Открыть</Button>
            </div>
            <div className="title-and-date ui flex row margin optimize gap">
                <Input placeholder="Заголовок материала" className="title-input"
                       onInput={ value => setMaterialProps({ title: value }) }>
                    { materialProps.title }
                </Input>

                <Input placeholder="Дата публикации" className={ classNames("date-input", { error: dateInputError }) }
                       onInput={ dateInputHandler }>
                    { materialProps.datetime }
                </Input>
            </div>

            <span className="ui opacity-75">Параметры материала</span>
            <div className="material-options ui flex row wrap margin optimize gap">
                <Input placeholder="Идентификатор" className="identifier-input" maxLength={ 156 }
                       mask={ [ [ /[^A-Za-z0-9\-_]/g, "" ] ] }
                       onInput={ value => setMaterialProps({ identifier: value }) }>
                    { props.identifier }
                </Input>

                <CheckBox checked={ materialProps.pinned }
                          onChange={ checkState => setMaterialProps({ pinned: checkState }) }>
                    Закрепить материал
                </CheckBox>
            </div>

            <span className="ui opacity-75">Теги материала</span>
            <div className="material-tags ui flex row wrap margin optimize gap">
                { materialData.tags.map((tag, index) => {
                    const checked = materialData.data.tags.toLocaleLowerCase().includes(tag.toLocaleLowerCase());
                    const onChange = (state: boolean) => {
                        const localTagsList = materialProps.tags.filter(e => e != tag);
                        if (state) localTagsList.push(tag);

                        setMaterialProps({ tags: localTagsList });
                    };

                    return <CheckBox checked={ checked } key={ index } onChange={ onChange }>
                        { tag }
                    </CheckBox>;
                }) }
            </div>

            <span className="ui opacity-75">Краткое содержание материала</span>
            <textarea className="ui clean interactive material-description"
                      placeholder="Введите краткое содержание материала"
                      defaultValue={ materialData.data.description }
                      onInput={ e => setMaterialProps({ description: (e.target as HTMLTextAreaElement).value }) }
            />

            <span className="ui opacity-75">Полный текст материала</span>
            <ReactEditorJS onInitialize={ handleInitialize } tools={ { ...defaultToolsList } }
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

    /**
     * Handler for material updating
     */
    async function materialUpdateHandler () {
        setLoading(true);
        const { formDataEntries } = await useFullAuthentication();

        if (!editorCore.current) {
            props.notify && props.notify.add("Ошибка определения экземпляра редактора");
            return setLoading(false);
        }

        const materialPropsConverter = (props: ItemObject.ProcessedMaterial): ItemObject.Material => {
            const { pinned, tags, datetime, ...pureProps } = props;
            return {
                ...pureProps,
                pinned: pinned ? "1" : "0",
                tags: tags.join(","),
                datetime: (new Date(datetime).getTime() / 1000).toString()
            };
        };

        const materialText = await editorCore.current.save();
        const formData = new MakeFormData({
            ...formDataEntries,
            [RequestOptions.updateMaterial]: props.identifier,
            [RequestOptions.updateMaterialData]: JSON.stringify(materialPropsConverter(materialProps)),
            [RequestOptions.updateMaterialText]: JSON.stringify(materialText)
        });

        const response = await fetch(makeRoute(serverRoutesList.updateMaterial), formData.fetchObject)
            .then(response => response.json()) as Response<unknown>;

        setLoading(false);

        if (response && response.success) {
            if (props.notify) props.notify.add("Материал успешно обновлен");
            if (props.onMaterialUpdate) props.onMaterialUpdate();
        } else props.notify && props.notify.add("Ошибка обновления материала");
    }

    async function previewChangeHandler () {
        setFileSelectDisplay(true);

        fileSelectCallback.current = (file?: string) => {
            if (file) setMaterialProps({ preview: serverRoutesList.getFile(file, false) });
        };
    }

    // Render the things that were before
    return <div className="view material-view ui grid center">
        <FileSelect callback={ fileSelectCallback } display={ fileSelectDisplay }
                    onSelectCancel={ () => setFileSelectDisplay(false) } />
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