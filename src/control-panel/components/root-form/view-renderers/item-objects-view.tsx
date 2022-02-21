import React from "react";
import MakeFormData from "../../../../lib/make-form-data";

import { makeRoute, serverRoutesList } from "../../../../lib/routes-list";
import { Controlled as CodeMirror } from "react-codemirror2";

import { RequestOptions, Response, VariableOptions } from "../../../../lib/types/requests";

import { ItemObject } from "../item-object-renderers/renderers";
import Button from "../../../../common/button";

import prettyBytes from "pretty-bytes";
import Notify from "../../../../common/notify";
import classNames from "../../../../lib/class-names";
import { useFullAuthentication } from "../../../../lib/use-full-authentication";

const codeMirrorStringsMode = () => ({
    startState: () => ({ inString: false }),
    token: (stream: any, state: { [key: string]: any }) => {
        if (!state.inString && stream.peek() == "\"") {
            stream.next();
            state.inString = true;
        }

        if (state.inString) {
            if (stream.skipTo("\"")) {
                stream.next();
                state.inString = false;
            } else stream.skipToEnd();
            return "string";
        } else {
            stream.skipTo("\"") || stream.skipToEnd();
            return null;
        }
    }
});

/**
 * Common view renderers properties list
 */
export interface CommonViewRendererProps {
    // Fires only when load state changed to true
    onLoadStart? (): void;

    // Fires only when load state changed to false
    onLoadEnd? (): void;

    // Fires every time when load state changes
    onLoadStateChange? (loadState: boolean): void;
}

export interface CommonRootComponentProps {
    notify?: Notify;
}

interface FileViewRendererProps extends CommonViewRendererProps, ItemObject.File {
    // Fires when file successfully deleted
    onFileDelete? (): void;
}

/**
 * Renderer for the file item objects
 * @inner
 *
 * @constructor
 */
export function FileViewRenderer (props: FileViewRendererProps) {
    const [ preview, setPreview ] = React.useState<[ Blob, string ] | null>();

    /**
     * Available blob types in the response
     */
    const BlobResponseTypes = {
        plainText: "text/plain",
        jpegImage: "image/jpeg",
        pngImage: "image/png"
    };

    /**
     * Renderer for the "no-preview" panel
     * @param extension file extension
     */
    function noFilePreviewPanelRenderer (extension: string) {
        return <div className="no-file-preview ui flex column limit-380 lh-26 gap-20">
            <i className="bi bi-journal-x ui fz-48 no-file-preview-icon" />
            <span>
            Предпросмотр для файлов типа <span className="ui badge">{ extension }</span>{ " " }
                недоступен или произошла ошибка при получении данных файла
        </span>
        </div>;
    }

    /**
     * Shortcut for the loading state updating
     * @param loading loading state
     */
    const setLoading = (loading: boolean) => {
        if (loading && props.onLoadStart) props.onLoadStart();
        if (!loading && props.onLoadEnd) props.onLoadEnd();

        if (props.onLoadStateChange) props.onLoadStateChange(loading);
    };

    /**
     * Get file preview from the server
     */
    React.useEffect(() => {
        setLoading(true);

        // Clean preview data
        setPreview(undefined);

        // Get preview from the server
        getFilePreviewBlob(props.filename).then(async response => {
            if (!response) return setPreview(response);

            switch (response.type) {
                case BlobResponseTypes.plainText:
                    return setPreview([ response, await response.text() ]);

                case BlobResponseTypes.jpegImage:
                case BlobResponseTypes.pngImage:
                    return setPreview([ response, URL.createObjectURL(response) ]);

                default:
                    return setPreview(null);
            }

        }).finally(() => setLoading(false));
    }, [ props.identifier ]);

    /**
     * Function for requiring preview data as Blob
     * object from the server
     *
     * @param filename required file name
     */
    async function getFilePreviewBlob (filename: string) {
        const { formDataEntries } = await useFullAuthentication();
        const name = filename.split(".").slice(0, -1).join(".");
        const ext = filename.split(".").slice(-1)[0].toLocaleLowerCase();

        const formData = new MakeFormData({
            ...formDataEntries,
            [RequestOptions.getFilePreview]: name + "." + ext
        });

        // Send preview data request
        const response = await fetch(makeRoute(serverRoutesList.getFilePreview), formData.fetchObject)
            .then(response => response.blob());

        if (!response || response.size == 0) return null;
        return response;
    }

    /**
     * Renderer for the file preview (based on the response type)
     * @param filename required file name (for name display)
     * @param preview file preview processed data
     */
    function renderFilePreview (filename: string, preview?: [ Blob, string ] | null) {
        if (preview === undefined) return <span className="ui flex row opacity-75 gap">
            <i className="ui loading-spinner" /> Загрузка содержимого файла...
        </span>;

        /**
         * Information about file and controls (remove button)
         */
        const name = filename.split("/").slice(1).join("/");
        const fileControls = <div className="file-controls ui flex row center-ai">
            <div className="file-info-block ui text-left lh-24">
                <span
                    className="file-name ui word-break-all text-left">{ name.length > 0 ? name : filename }</span>{ " " }
                { preview && <span className="file-size ui badge fz-14 w-fit">{ prettyBytes(preview[0].size) }</span> }
            </div>
            <div className="file-controls-block ui flex w-fit row">
                <Button icon="bi bi-trash-fill" onClick={ () => deleteFileHandler(filename) }>
                    Удалить
                </Button>
            </div>
        </div>;

        // If no preview data returned from server, render "no-preview" panel
        if (!preview) return <div className="renderers-container">
            { noFilePreviewPanelRenderer(props.filename.split(".").slice(-1)[0]) }
            { fileControls }
        </div>;

        // Define renderers for each file type
        const imageRenderer = <img src={ preview[1] } alt="" className="object-preview" />;
        const plainTextRenderer = <div className="object-preview ui text-left" dangerouslySetInnerHTML={ {
            __html: preview[1].replace(/\r?\n/g, "<br />")
        } } />;

        // Render preview based on file type
        return <div className="renderers-container">
            { fileControls }
            {
                ({
                    [BlobResponseTypes.plainText]: plainTextRenderer,
                    [BlobResponseTypes.pngImage]: imageRenderer,
                    [BlobResponseTypes.jpegImage]: imageRenderer
                })[preview[0].type]
            }
        </div>;
    }

    /**
     * Function for removing file from the server
     *
     * @param filename name of the file to be removed
     */
    async function deleteFileHandler (filename: string) {
        setLoading(true);

        const { formDataEntries } = await useFullAuthentication();

        const formData = new MakeFormData({
            ...formDataEntries,
            [RequestOptions.deleteFile]: filename
        });

        // Send file delete request
        const response = await fetch(makeRoute(serverRoutesList.deleteFile), formData.fetchObject)
            .then(response => response.json()) as Response;

        // If request successful, update root form content
        if (response.success && props.onFileDelete) props.onFileDelete();
        setLoading(false);
    }

    // Render all of these things that was before
    return <div className="view files-view ui grid center">
        <div className="view-content-wrapper ui grid text-center center w-100">
            { renderFilePreview(props.filename, preview) }
        </div>
    </div>;
}

interface VariableViewRendererProps extends CommonViewRendererProps, ItemObject.Variable, CommonRootComponentProps {
    onContentUpdate? (): void;
}

/**
 * Renderer for the file item objects
 *
 * @constructor
 */
export function VariableViewRenderer (props: VariableViewRendererProps) {
    const [ value, setValue ] = React.useState<string>(String(props.value));
    React.useEffect(() => {
        if (value != String(props.value)) setValue(String(props.value));
    }, [ props.value ]);

    /**
     * Shortcut for the loading state updating
     * @param loading loading state
     */
    const setLoading = (loading: boolean) => {
        if (loading && props.onLoadStart) props.onLoadStart();
        if (!loading && props.onLoadEnd) props.onLoadEnd();

        if (props.onLoadStateChange) props.onLoadStateChange(loading);
    };

    /**
     * Function for sending update request to the server
     */
    async function variableUpdateHandler () {
        setLoading(true);

        const { formDataEntries } = await useFullAuthentication();
        const formData = new MakeFormData({
            ...formDataEntries,
            [VariableOptions.updateVariableName]: props.name,
            [VariableOptions.updateVariableValue]: value
        });

        // Send request to the server
        const response = await fetch(makeRoute(serverRoutesList.updateVariable), formData.fetchObject)
            .then(response => response.json()) as Response<unknown>;

        // If notify class provided, use it to display update result
        if (props.notify) {
            if (!response || !response.success) props.notify.add("Не удалось обновить переменную в базе данных");
            else props.notify.add("Переменная обновлена в базе данных");
        }

        if (props.onContentUpdate) props.onContentUpdate();
    }

    const isJSON = [ "[", "{" ].includes(value.trim().replace(/(\s|\t|\r\n|\r|\n)/g, "")[0]);
    const isJSONValid = isJSON ? (() => {
        try {
            JSON.parse(value);
            return true;
        } catch (error: any) {
            return error.message ? error.message : false;
        }
    })() : true;

    // Disable button if content not changed
    const updateButtonClassName = classNames({
        disabled: props.value === value.trim() || (isJSON && isJSONValid !== true)
    });

    return <div className="view variable-view ui grid center h-100">
        <div className="view-content-wrapper ui flex column h-fit limit-1280">
            <CodeMirror className="ui w-100 clean opacity-85 bg-white margin-bottom"
                        value={ value } options={ { lineNumbers: true } }
                        onBeforeChange={
                            (editor, data, value) => setValue(value)
                        } defineMode={ { name: "strings", fn: codeMirrorStringsMode } } />

            { isJSON && <div className="json-validation">
                Состояние переменной (для JSON): {
                isJSONValid === true
                    ? <span className="valid">Проверка пройдена</span>
                    : <span className="invalid">Ошибка{ isJSONValid === false ? "" : ": " + isJSONValid }</span> }
            </div> }
            <div className="variable-controls ui flex row">
                {/*<span className="save-hint ui fz-14 opacity-65 limit-460">*/ }
                {/*    Изменения в переменной не сохраняются автоматически, не забывайте обновлять значение переменной*/ }
                {/*    нажатием кнопки "Обновить"*/ }
                {/*</span>*/ }
                <Button icon="bi bi-arrow-clockwise" onClick={ variableUpdateHandler }
                        className={ updateButtonClassName }>Обновить</Button>
            </div>
        </div>
    </div>;
}
