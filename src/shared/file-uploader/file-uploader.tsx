import React from "react";
import "./file-uploader.scss";
import PageWrapper from "../page-wrapper";
import Group from "../group-component";
import Button from "../button-component";
import { createBootstrapIcon } from "../shared-content";

namespace FileUploader
{
    export interface Properties
    {
        uploadHint?: string
    }

    export interface State
    {
        filesList: File[]
    }
}

export default class FileUploader extends React.PureComponent<FileUploader.Properties, FileUploader.State>
{
    state: FileUploader.State = { filesList: [] };

    // todo: create uploading function
    private fileSelectInterface ()
    {
        const inputElement = document.createElement("input") as HTMLInputElement;
        inputElement.multiple = true;
        inputElement.type = "file";

        inputElement.addEventListener("change", () =>
        {
            const files = inputElement.files
                ? Array.from(inputElement.files).filter(file => file.type != "image/jpeg")
                : [];

            inputElement.remove();

            if (!files.length) return;
            this.setState({ filesList: files });
        });

        inputElement.click();
    }

    render (): React.ReactNode
    {
        const hint = this.props.uploadHint || "Кликните или перетащите файлы в эту область, чтобы начать загрузку",
            fileUploadIcon = createBootstrapIcon("cloud-upload-fill");

        // todo: add icon component to create icons separately from other components
        // todo: create server request for searching file extension icons

        // todo: display selected files
        return <PageWrapper contentClassName="file-uploader-component">
            <Group title="Загрузить файлы" className="semi-transparent"
                   topLevelChildren={ <div className="files-uploading-progress" /> }
                   onClick={ this.fileSelectInterface.bind(this) }>

                <span className="upload-hint">{ hint }</span>
            </Group>
            <Button icon={ fileUploadIcon } disabled={ !this.state.filesList.length }>Загрузить файлы</Button>
        </PageWrapper>;
    }
}
