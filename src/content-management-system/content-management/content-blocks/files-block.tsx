// Library import
import React from "react";
// Internal components import
import PageWrapper from "../../../shared/page-wrapper";
import FilesList from "../../internal-components/files-list";
import FileUploader from "../../internal-components/file-uploader";
// Helpers import
import { DirectoryEntry } from "../../internal-components/files-list/files-list";
import { defaultPathsList, RequestBody, requireCachedAccountData } from "../../../shared/shared-content";
import { Requests } from "../../../shared/shared-types";
import CacheController, { CacheKeys } from "../../../shared/cache-controller";

/**
 * Action block for display and modify
 * files stored in user content storage
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 */
export default function FilesBlock ()
{
    const [ filesList, setFilesList ] = React.useState<{ [key: string]: DirectoryEntry }>();

    /**
     * Require files list from server
     */
    const updateFilesList = () => new Promise<void>(async (resolve, reject) =>
    {
        // Check if cache has stored account data
        const accountData = requireCachedAccountData();

        // Require files list from server
        const filesList = await fetch(defaultPathsList.request, new RequestBody({
            [Requests.TypesList.Action]: Requests.ActionsList.getFilesList,
            [Requests.TypesList.AccountLogin]: accountData.login,
            [Requests.TypesList.AccountHash]: accountData.hash
        }).postFormData)
            .then(request => request.json()) as Requests.RequestResult<{ [key: string]: DirectoryEntry }>;

        // If files list request failed, reject
        if (!filesList.success) return reject(filesList.meta.toString());

        // Update files list and resolve promise (load page)
        setFilesList(filesList.meta);

        window.dispatchEvent(new Event("resize"));
        resolve();
    });

    /**
     * Accordion click (open and close) event handler
     *
     * @param state component open state
     * @param index component local index
     */
    const onAccordionChange = (index: number, state: boolean) =>
    {
        const cacheController = new CacheController(window.localStorage);
        if (state) cacheController.cacheContent(CacheKeys.cmsFilesAccordionOpen, index);
        else cacheController.removeCachedContent(CacheKeys.cmsFilesAccordionOpen);

        setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
    };

    return <PageWrapper className="content-block files-block" asyncContent={ updateFilesList }>
        <FileUploader endpoint={ defaultPathsList.request } onUpdate={ updateFilesList } />
        { filesList && <FilesList filesList={ filesList } reverse={ true } onAccordionChange={ onAccordionChange }
                                  updateFilesList={ updateFilesList } /> }
    </PageWrapper>;
}
