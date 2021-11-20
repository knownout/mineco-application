// Library import
import React from "react";
// Internal components import
import Group from "../../../shared/group";
import Button from "../../../shared/button";
import PageWrapper from "../../../shared/page-wrapper";
// EditorJS configuration import
import {
    EditorJSCoreToolConfiguration,
    EditorJSLocalizationConfiguration
} from "../../../shared/editor-js-configuration";
import EditorJS from "@editorjs/editorjs";
// Helpers import
import { defaultPathsList, executeWithRecaptcha, RequestBody } from "../../../shared/shared-content";
import { IAccountData, Requests } from "../../../shared/shared-types";
import CacheController, { CacheKeys } from "../../../shared/cache-controller";
import { MD5 } from "crypto-js";
// External components import
const { createReactEditorJS } = require("react-editor-js");
// Shortcuts
const TypesList = Requests.TypesList;
const ActionsList = Requests.ActionsList;
const ReactEditorJS = React.memo(createReactEditorJS());

/**
 * Action block for display properties editors (db properties table)
 * Currently available only importantData property (for version 0.0.1)
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 */
export default function PropertiesBlock ()
{
    // Value from database
    const [ editorInstanceDefaultValue, setEditorInstanceDefaultValue ] = React.useState<object>();

    // Reference to native editor.js instance
    const editorJS = React.useRef<EditorJS | null>(null);

    // Fired when editor js loaded (onReady callback maybe?)
    const handleInitialize = React.useCallback((instance) => (editorJS.current = instance), []);

    // Save changes button click handler
    const onButtonClick = async () => new Promise<void>(async (resolve, reject) =>
    {
        // Check if native editor instance available
        if (editorJS.current)
        {
            // Get list of paragraphs from editor content
            const blocks = (await editorJS.current.save()).blocks.filter(block => block.type == "paragraph");

            // Variable for retrieving text content from editor
            let totalContentData = String();

            // Get content from each paragraph to totalContentData
            blocks.forEach(block => totalContentData += block.data.text as string);

            // If no blocks or total content length too short, reject
            if (blocks.length < 1
                || totalContentData.trim().replace(/[^A-Za-zА-Яа-яЁё]/g, "").length < 10
            ) reject("no content provided");
            else
            {
                // Not necessary, but executing with recaptcha protection
                executeWithRecaptcha("submit").then(token =>
                {
                    const cacheController = new CacheController(window.localStorage);

                    // Read account data from browser localStorage
                    const accountData = cacheController.fromCache<IAccountData>(CacheKeys.accountData) as IAccountData;

                    // If no account data specified, redirect to authentication page
                    if (!accountData) window.location.href = defaultPathsList.contentManagementSystem;

                    else
                    {
                        // Send update request to server
                        fetch(defaultPathsList.request, new RequestBody({
                            [TypesList.Action]: [ ActionsList.updateProperty ],

                            [TypesList.Property]: "importantData",
                            [TypesList.PropertyValue]: JSON.stringify(blocks),

                            [TypesList.CaptchaToken]: token,

                            [TypesList.AccountLogin]: accountData.login,
                            [TypesList.AccountHash]: MD5(accountData.password)
                        }).postFormData)
                            .then(request => request.json())
                            .then((result: Requests.RequestResult<IAccountData>) =>
                            {
                                // Check if update successful
                                if (!result.success) reject(result.meta);
                                else resolve();
                            }).catch(reject);
                    }
                });
            }
            // Reject if no blocks or content too short
        } else reject();
    });

    // Require property values from server
    const propertiesContentRequest = () => new Promise<void>((resolve, reject) =>
    {
        fetch(defaultPathsList.request, new RequestBody({
            [TypesList.Action]: [ ActionsList.getFromProperties ],
            [TypesList.Property]: "importantData"
        }).postFormData).then(request => request.json()).then((result: Requests.RequestResult) =>
        {
            // Check if there is content in result (if error, resolve too)
            if (!result.success) resolve();
            else
            {
                setEditorInstanceDefaultValue({ time: 0, version: "0", blocks: JSON.parse(result.meta.value) });

                // Timeout used for more smooth animation
                // fixme: is timeout really do things more smooth?
                setTimeout(resolve, 50);
            }
        }).catch(reject);
    });

    return <PageWrapper asyncContent={ propertiesContentRequest }>
        <div className="properties-block content-block">
            {/* Group for importantData property */ }
            <Group title="Важная информация" className="editor-js-group semi-transparent">
                <div id="editor-js-holder-rich-text">
                    <ReactEditorJS { ...EditorJSCoreToolConfiguration } { ...EditorJSLocalizationConfiguration }
                                   onInitialize={ handleInitialize } data={ editorInstanceDefaultValue }
                                   onChange={ () => window.dispatchEvent(new Event("resize")) } />
                </div>
                <Button onAsyncClick={ onButtonClick }>Сохранить изменения</Button>
            </Group>
        </div>
    </PageWrapper>;
}
