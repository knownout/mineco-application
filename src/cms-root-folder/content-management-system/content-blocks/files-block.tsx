// Library import
import React from "react";
// Internal components import
import PageWrapper from "../../../shared/page-wrapper";
import FileUploader, { ICustomFileUploaderProps } from "../../../shared/file-uploader";
// Helpers import
import {
    defaultPathsList,
    executeWithRecaptcha,
    RequestBody,
    softVerifyStoredAccountData
} from "../../../shared/shared-content";
import { Requests } from "../../../shared/shared-types";

/**
 * Action block for uploading files to server
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 *
 * @deprecated
 */
export default function FilesBlock ()
{
    const [ uploaderTitle, setUploaderTitle ] = React.useState([ "Загрузить фалйы", "" ]);

    /**
     * Function for uploading files to server through FileUploader component
     *
     * @param props ICustomFileUploaderProps
     */
    const customFilesUploader = async (props: ICustomFileUploaderProps) =>
    {
        // Iterate through all selected files
        for await (const [ key, file ] of props.files.entries())
        {
            // Get account data or redirect to auth page
            const accountData = softVerifyStoredAccountData();

            // Get recaptcha token
            const token = await executeWithRecaptcha("submit");

            // Get request body
            const postFormData = new RequestBody({
                [Requests.TypesList.Action]: Requests.ActionsList.uploadFile,

                [Requests.TypesList.AccountLogin]: accountData.login,
                [Requests.TypesList.AccountHash]: accountData.hash,

                [Requests.TypesList.CaptchaToken]: token,

                [Requests.TypesList.FileToken]: file
            }).postFormData;

            // Create new request (fetch not supports uploading progress)
            const request = new XMLHttpRequest();

            // Calculate initial percents for current file key
            const initialPercents = Math.round(key * (100 / props.files.length));

            // Send request and wait for result
            await new Promise<void>(resolve =>
            {
                request.upload.onprogress = progress =>
                {
                    const percent = initialPercents
                        + Math.round((progress.loaded / file.size * 100) / props.files.length);

                    setUploaderTitle([
                        `Загрузка файла ${ key + 1 } из ${ props.files.length }`,
                        ` ${ percent }% завершено`
                    ]);

                    props.onProgressChange(percent);
                };
                request.upload.onerror = () =>
                {
                    props.reject("error while loading file");
                    resolve();
                };

                request.upload.onloadend = () =>
                {
                    props.onProgressChange(initialPercents + Math.round(100 / props.files.length));
                    setTimeout(() =>
                    {
                        if (key == props.files.length - 1)
                        {
                            setUploaderTitle([ "Загрузить фалйы", "" ]);
                            props.onProgressChange(-1);
                            props.dropFilesList();
                            props.resolve();
                        }

                        resolve();
                    }, 1000);
                };

                request.open(postFormData.method, defaultPathsList.request);
                request.timeout = 0;
                request.send(postFormData.body);
            });
        }
    };

    return <PageWrapper>
        <div className="files-block content-block">
            <FileUploader
                onUpload={ customFilesUploader }
                groupTitle={ uploaderTitle[0] }
                groupSubTitle={ uploaderTitle[1] } />
        </div>
    </PageWrapper>;
}
