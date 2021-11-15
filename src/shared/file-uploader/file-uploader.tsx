import React from "react";
import "./file-uploader.scss";
import Button from "../button-component/button-component";
import { createBootstrapIcon } from "../shared-content";
import Group from "../group-component/group-component";

export interface ICustomFileUploaderProps
{
    files: File[],
    resolve: () => void,
    reject: (reason?: string) => void,

    onProgressChange (progress: number): void,

    dropFilesList: () => void;
}

interface IFileUploaderProps
{
    multiple?: boolean

    hintText?: string

    groupTitle?: string

    groupSubTitle?: string

    onUpload? (props: ICustomFileUploaderProps): void;

    onSelect? (files: File[]): void

}

export default function FileUploader (props: IFileUploaderProps)
{
    const [ files, setFiles ] = React.useState<File[]>();
    const [ uploadingProgress, setUploadingProgress ] = React.useState(0);

    const readSelectedFiles = () =>
    {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;

        input.onchange = () =>
        {
            if (!input.files || input.files.length < 1) return;
            const fileList = Array.from(input.files).filter(file => file.type != "image/jpeg");

            if (fileList.length < 1) return;
            if (props.onSelect) props.onSelect(fileList);

            setFiles(fileList);
        };

        input.click();
    };

    const onProgressChange = (progress: number) => setUploadingProgress(progress);
    const uploadSelectedFiles = () => new Promise<void>((resolve, reject) =>
    {
        if (!files) return reject();

        if (props.onUpload) props.onUpload({
            files,
            resolve,
            reject,
            onProgressChange,
            dropFilesList: () => setFiles(undefined)
        });
        else resolve();
    });

    const uploadProgressStyles = uploadingProgress < 100 && uploadingProgress >= 0
        ? { width: uploadingProgress + "%" }
        : (uploadingProgress == 100 ? {
            width: "100%",
            backgroundColor: "rgba(154, 226, 102, 0.3)"
        } : { width: "0%" });

    return <Group className="semi-transparent upload-file" title={ props.groupTitle || "Загрузить файлы" }
                  outerScopeElement={ <div className="files-uploading-progress"
                                           style={ uploadProgressStyles } /> }
                  subTitle={ props.groupSubTitle }>

        { props.hintText && <span className="hint">{ props.hintText }</span> }
        <div className="inline-group">
            <Button onClick={ readSelectedFiles } icon={ createBootstrapIcon("cursor-fill") }
                    className="button-select ellipsis" disabled={ (uploadingProgress > 0 && uploadingProgress < 100) }>
                { !files ? "Выберите файлы для загрузки" : (files.length == 1 ? files[0].name
                    : `${ files.length } файлов выбрано`) }
            </Button>
            <Button icon={ createBootstrapIcon("file-earmark-arrow-up-fill") } disabled={ !files }
                    className="button-upload" onAsyncClick={ uploadSelectedFiles }>
                Загрузить
            </Button>
        </div>
    </Group>;

}
