// Library import
import React from "react";
// Helpers import
import * as Shared from "../shared-content";
import { IAccountData, Requests } from "../shared-types";
import CacheController, { CacheKeys } from "../cache-controller";
import { MD5 } from "crypto-js";
// Internal components import
import PageWrapper from "../page-wrapper";
import Group from "../group-component";
import Button from "../button-component";
// Stylesheets import
import "./file-uploader.scss";

namespace FileUploader
{
    export interface Properties
    {
        uploadHint?: string
    }

    export interface State
    {
        filesList: File[],
        uploadProgress: number | "complete"
    }
}

/**
 *
 * Component for creating advanced file uploading interface
 * with progress tracking and multi-files uploading to single-file
 * uploading request
 *
 * todo: add drag-n-drop ability
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.1.0
 */
export default class FileUploader extends React.PureComponent<FileUploader.Properties, FileUploader.State>
{
    state: FileUploader.State = { filesList: [], uploadProgress: 0 };

    private readonly cacheController = new CacheController(window.localStorage);

    /**
     * Open files select interface
     */
    private fileSelectInterface ()
    {
        // Create new files input element
        const inputElement = document.createElement("input") as HTMLInputElement;
        inputElement.multiple = true;
        inputElement.type = "file";

        // Listen for changes
        inputElement.addEventListener("change", () =>
        {
            // Filter files list
            const files = inputElement.files
                ? Array.from(inputElement.files).filter(file => file.type != "image/jpeg")
                : [];

            // Free memory
            inputElement.remove();

            // Update local files list
            if (!files.length) return;
            this.setState({ filesList: files });
        });

        inputElement.click();
    }

    // todo: create uploading function
    private async uploadFiles ()
    {
        // Get account data from cache
        const accountData = this.cacheController.fromCache(CacheKeys.accountData) as IAccountData;

        // Get recaptcha token
        const token = await Shared.executeWithRecaptcha("submit");

        // Define request body core properties
        const requestBody = new Shared.RequestBody({
            [Requests.TypesList.Action]: [ Requests.ActionsList.uploadFile ],
            [Requests.TypesList.AccountLogin]: accountData.login,
            [Requests.TypesList.AccountHash]: MD5(accountData.password),
            [Requests.TypesList.CaptchaToken]: token
        });

        // Wait for all files upload finish
        await new Promise<void>(async (resolve, reject) =>
        {
            resolve();
        });
    }

    render (): React.ReactNode
    {
        // Check for hint in properties or set default
        const hint = this.props.uploadHint || "Кликните или перетащите файлы в эту область, чтобы начать загрузку",
            fileUploadIcon = Shared.createBootstrapIcon("cloud-upload-fill");

        // Get width and class name for uploading progress bar element
        const width = (Number.isInteger(this.state.uploadProgress) ? this.state.uploadProgress : 100) + "%";
        const className = Shared.classNames("files-uploading-progress", {
            complete: this.state.uploadProgress == "complete"
        });

        return <PageWrapper contentClassName="file-uploader-component">
            <Group title="Загрузить файлы" className="semi-transparent"
                   topLevelChildren={ <div className={ className } style={ { width } } /> }
                   onClick={ this.fileSelectInterface.bind(this) }>

                <span className="upload-hint">{ hint }</span>
                { this.state.filesList.map(file => <SelectedFileComponent name={ file.name } key={ Math.random() } />) }
            </Group>
            <Button icon={ fileUploadIcon } onAsyncClick={ this.uploadFiles.bind(this) }
                    disabled={ !this.state.filesList.length }>Загрузить файлы</Button>
        </PageWrapper>;
    }
}

/**
 * Inner component for creating selected items in FileUploader component
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.1.0
 */
function SelectedFileComponent (props: { name: string })
{
    const extension = props.name.split(".").slice(-1)[0];

    return <div className="selected-file">
        <i className="icon"
           style={ { backgroundImage: `url("${ Shared.defaultPathsList.openExtensionIcon(extension) }")` } } />
        <span className="file-name">{ props.name }</span>
    </div>;
}
