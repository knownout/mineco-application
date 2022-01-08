import React from "react";

import useRecaptcha from "../../../../lib/use-recaptcha";
import MakeFormData from "../../../../lib/make-form-data";

import { appRoutesList, makeRoute, serverRoutesList } from "../../../../lib/routes-list";
import CacheController, { cacheKeysList } from "../../../../lib/cache-controller";

import { RequestOptions, Response } from "../../../cms-types/requests";
import { Account } from "../../../cms-types/account";

import { ItemObject } from "../item-object-renderers/renderers";
import verifyAuthentication from "../../../cms-lib/verify-authentication";
import Button from "../../../../common/button";

import prettyBytes from "pretty-bytes";

const cacheController = new CacheController(localStorage);

/**
 * Common view renderers properties list
 */
interface CommonViewRendererProps {
    // Fires only when load state changed to true
    onLoadStart? (): void;

    // Fires only when load state changed to false
    onLoadEnd? (): void;

    // Fires every time when load state changes
    onLoadStateChange? (loadState: boolean): void;

    // Fires when file successfully deleted
    onFileDelete? (): void;
}

/**
 * Renderer for the file item objects
 * @inner
 *
 * @constructor
 */
export function FileViewRenderer (props: ItemObject.File & CommonViewRendererProps) {
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
        const authResult = await verifyAuthentication();
        const accountData = cacheController.getItem<Account.Response>(cacheKeysList.accountData);

        // Verify authentication
        if (!authResult || !accountData) {
            cacheController.removeItem(cacheKeysList.accountData);
            window.location.href = appRoutesList.auth;

            throw new Error("Не удалось проверить данные аккаунта");
        }

        const token = await useRecaptcha();
        const formData = new MakeFormData({
            [RequestOptions.recaptchaToken]: token,
            [RequestOptions.accountLogin]: accountData.login,
            [RequestOptions.accountHash]: accountData.hash,
            [RequestOptions.getFilePreview]: filename
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
        const fileControls = <div className="file-controls ui flex row center-ai wrap">
            <div className="file-info-block ui text-left lh-24">
                <span className="file-name ui word-break-all text-left">{ filename }</span>{ " " }
                { preview && <span className="file-size ui badge fz-14 w-fit">{ prettyBytes(preview[0].size) }</span> }
            </div>
            <div className="file-controls-block ui flex w-fit row">
                <Button icon="bi bi-trash-fill" onClick={ () => deleteFileHandler(filename) }>
                    Удалить файл
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

        const token = await useRecaptcha();
        const authResult = verifyAuthentication();
        const accountData = cacheController.getItem<Account.Response>(cacheKeysList.accountData);

        // Verify authentication
        if (!authResult || !accountData) {
            window.location.href = appRoutesList.auth;
            throw new Error("Не удалось проверить данные аккаунта");
        }

        const formData = new MakeFormData({
            [RequestOptions.recaptchaToken]: token,
            [RequestOptions.accountLogin]: accountData.login,
            [RequestOptions.accountHash]: accountData.hash,
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
        <div className="view-content-wrapper ui grid text-center center ">
            { renderFilePreview(props.filename, preview) }
        </div>
    </div>;
}