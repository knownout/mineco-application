// Library import
import React from "react";
// Helpers import
import * as Shared from "../shared-content";
import { classNames, executeWithRecaptcha, RequestBody, requireCachedAccountData } from "../shared-content";
import { Requests } from "../shared-types";
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
        /** Component uploading hint text */
        uploadHint?: string

        /** Allow multiple files */
        multiple?: boolean

        /** Specify server to upload files */
        endpoint: string
    }

    export interface State
    {
        /** List of selected files */
        filesList: File[]

        /** Files list uploading state */
        upload: TUploadState

        /** Changed when files drag on top of uploading area */
        dragOverArea: boolean
    }

    export type TUploadState = {
        /** Uploading progress (from 0 to 100) */
        progress: number

        /** Files uploading state (for whole payload) */
        state: "uploading" | "complete" | "final-in" | "final-out" | "default"
    }
}

/**
 *
 * Component for creating advanced file uploading interface
 * with progress tracking and multi-files uploading to single-file
 * uploading request
 *
 * todo: add percents display at component title or somewhere else
 * todo: remove part of internal dependencies
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.1.0
 */
export default class FileUploader extends React.PureComponent<FileUploader.Properties, FileUploader.State>
{
    state: FileUploader.State = { filesList: [], upload: { progress: 0, state: "default" }, dragOverArea: false };

    /**
     * Internal function for dynamically update upload state (like setState)
     * @param state TUploadState
     */
    private setUploadState (state: Partial<FileUploader.TUploadState>)
    {
        type TObject = { [key: string]: any }

        // Clone current upload state to new object
        const currentState = Object.assign({}, this.state.upload) as TObject;

        // Get provided options to update
        const keys = Object.keys(state);

        // Update provided options in copied object
        keys.forEach(key => currentState[key] = (state as TObject)[key]);

        // Update component state if at least one option provided
        if (keys.length > 0) this.setState({
            upload: currentState as FileUploader.TUploadState
        });
    }

    /**
     * Open files select interface
     */
    private fileSelectInterface ()
    {
        // Create new files input element
        const inputElement = document.createElement("input") as HTMLInputElement;
        inputElement.multiple = this.props.multiple !== false;
        inputElement.type = "file";

        // Listen for changes
        inputElement.addEventListener("change", () =>
        {
            // Filter files list
            const files = inputElement.files ? Array.from(inputElement.files) : [];

            // Free memory
            inputElement.remove();

            // Update local files list
            if (!files.length) return;

            this.setState({ filesList: files }, () => window.dispatchEvent(new Event("resize")));
        });

        inputElement.click();
    }

    /**
     * Selected files list uploading procedure
     */
    private async uploadFiles ()
    {
        // Create new XMLHttpRequest due to fetch do not support uploading progress
        const request = new XMLHttpRequest();

        // Wait for all files upload finish
        return new Promise<void>(async (resolve, reject) =>
        {
            // Get hashed account data
            const accountData = requireCachedAccountData();

            const requestBody = new RequestBody({
                [Requests.TypesList.Action]: [ Requests.ActionsList.uploadFile ],
                [Requests.TypesList.AccountLogin]: accountData.login,
                [Requests.TypesList.AccountHash]: accountData.hash
            });

            // Get maximum percents for single file
            const percentsByFile = Math.round(100 / this.state.filesList.length);

            this.setUploadState({ state: "uploading" });

            // Sequentially upload selected files
            for await (const [ key, file ] of this.state.filesList.entries())
            {
                // Get google recaptcha token
                const token = await executeWithRecaptcha("submit");

                // Add file and token to request body
                requestBody.push({
                    [Requests.TypesList.UploadFileToken]: file,
                    [Requests.TypesList.CaptchaToken]: token
                });

                // Get initial percents for current uploading session
                const initialPercents = percentsByFile * key;

                // Wait for file to be uploaded
                await new Promise<void>((resolve, reject) =>
                {
                    request.upload.onerror = request.onerror = reject;
                    request.upload.onprogress = progress =>
                    {
                        // Get percents relative to current file
                        let percents = initialPercents
                            + Math.ceil((progress.loaded / progress.total * 100) / this.state.filesList.length);

                        // Limit percents by 100
                        percents = (percents > 10) ? 100 : percents;

                        this.setUploadState({ progress: percents });
                    };

                    request.onloadend = () => resolve();

                    request.open("post", this.props.endpoint);
                    request.timeout = 0;
                    request.send(requestBody.formData);
                }).catch(() =>
                {
                    this.setUploadState({ state: "default" });
                    reject();
                });
            }

            // Add "complete" classname to the loader
            this.setUploadState({ state: "complete" });

            // After one second add "final-in" classname
            setTimeout(() => this.setUploadState({ state: "final-in" }), 1000);
            setTimeout(() =>
            {
                // Add "final-out" classname and reset progress & files list
                this.setState({ upload: { state: "final-out", progress: 0 }, filesList: [] });
                setTimeout(() =>
                {
                    // Rollback to default classname after animation ends
                    this.setUploadState({ state: "default" });
                }, 300);

                resolve();
            }, 1000);
        });
    }

    /**
     * Group component drag enter event handler
     */
    private readonly dragEventHandler = (event: React.DragEvent<HTMLDivElement>) =>
        this.state.dragOverArea != (event.type === "dragenter")
        && this.setState(prevState => ({ dragOverArea: !prevState.dragOverArea }));

    /**
     * Group component files drop event handler
     */
    private dropEventHandler (event: React.DragEvent<HTMLDivElement>)
    {
        if (this.state.dragOverArea) this.setState({ dragOverArea: false });
        if (event.dataTransfer.files) this.setState({
            filesList: Array.from(event.dataTransfer.files)
        });
    }

    render (): React.ReactNode
    {
        // Check for hint in properties or set default
        const hint = this.props.uploadHint || "Кликните или перетащите файлы в эту область, чтобы начать загрузку",
            fileUploadIcon = Shared.createBootstrapIcon("cloud-upload-fill");

        // Get width and class name for uploading progress bar element
        const className = classNames("files-uploading-progress", this.state.upload.state);
        const groupClassName = classNames("semi-transparent", {
            disabled: this.state.upload.state != "default",
            drag: this.state.dragOverArea
        });

        return <PageWrapper contentClassName="file-uploader-component">
            <Group title="Загрузить файлы"
                   className={ groupClassName }
                   topLevelChildren={ <div className={ className }
                                           style={ { width: this.state.upload.progress + "%" } } /> }
                   onClick={ this.state.upload.state == "default" ? this.fileSelectInterface.bind(this) : () => {} }
                   onDragEnter={ this.dragEventHandler.bind(this) }
                   onDragLeave={ this.dragEventHandler.bind(this) }
                   onDrop={ this.dropEventHandler.bind(this) }>

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
