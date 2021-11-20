// Library import
import React from "react";
// Helpers import
import * as Shared from "../../../shared/shared-content";
import { Requests } from "../../../shared/shared-types";
import CacheController, { CacheKeys } from "../../../shared/cache-controller";
// Internal components import
import PageWrapper from "../../../shared/page-wrapper";
import Accordion from "../../../shared/accordion";
// Stylesheet import
import "./files-list.scss";

namespace FilesList
{
    export interface Properties
    {
        /** List of user storage files */
        filesList: { [key: string]: DirectoryEntry }

        /** If true, directories order will be reversed */
        reverse?: boolean

        /**
         * Fires when accordion component opened or closed
         *
         * @param state component open state
         * @param index component local index
         */
        onAccordionChange? (index: number, state: boolean): void

        /** Function for updating files list on action block level */
        updateFilesList? (): void
    }
}

/** Server user content storage directory info object */
export type DirectoryEntry = {
    [key: string]: FileEntry
}

/** Same as directory entry, but for files */
export type FileEntry = {
    /** File extension */
    extension: string,

    /** File name (with extension) */
    name: string,

    /** File size */
    size: number
}

/**
 * Internal component for reading and displaying
 * user content storage files list
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.1.0
 */
export default class FilesList extends React.PureComponent<FilesList.Properties>
{
    /**
     * Method for reading getFiles request result
     */
    private readFilesListObject ()
    {
        const cacheController = new CacheController(window.localStorage);

        // Remember last open accordion component
        let openAccordionIndex = cacheController.fromCache(CacheKeys.cmsFilesAccordionOpen) as number;
        if (!Number.isInteger(openAccordionIndex)) openAccordionIndex = -1;

        // Get directories names as array
        let directories = Object.keys(this.props.filesList);

        // Reverse, if required
        if (this.props.reverse) directories = directories.reverse();

        return <Accordion defaultOpenItem={ openAccordionIndex } onItemChange={ this.props.onAccordionChange }>
            {
                directories.map((directoryKey) =>
                {
                    // Get directory information
                    const directory = this.props.filesList[directoryKey];

                    // Get file names in directory as array
                    const files = Object.keys(directory);

                    // Convert file names to ExtendedFileEntry component
                    const children = files.map(fileKey =>
                    {
                        const file = this.props.filesList[directoryKey][fileKey];
                        const onFileClick = () =>
                            window.open(Shared.defaultPathsList.openStorageFile(directoryKey, fileKey));

                        return <ExtendedFileEntry { ...file } date={ directoryKey } onClick={ onFileClick }
                                                  key={ Math.random() } updateFilesList={ this.props.updateFilesList }
                                                  extension={ file.extension } />;
                    });

                    return <Accordion.Item title={ directoryKey } children={ children } key={ Math.random() } />;
                })
            }
        </Accordion>;
    }

    render (): React.ReactNode
    {
        return <PageWrapper key={ Math.random() } loadingLabel="Получение данных о файлах" className="files-list"
                            onLoadComplete={ () => setTimeout(() =>
                                window.dispatchEvent(new Event("resize")), 100) }
                            children={ this.readFilesListObject() }
        />;
    }
}

interface IExtendedFileEntryProps
{
    /** Name of the file */
    name: string

    /** Size of the current file */
    size: number

    /** Container (folder) name */
    date: string

    /** Extension of the file */
    extension: string

    /** Fires when item clicked */
    onClick? (): void

    /** Files list update function reference */
    updateFilesList? (): void
}

/**
 * Internal component, extended version of the FileEntry component
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 */
function ExtendedFileEntry (props: IExtendedFileEntryProps)
{
    const [ fileRemoving, setFileRemoving ] = React.useState(false);
    const reference = React.createRef<HTMLDivElement>();

    // File removing procedure
    const removeFile = (event: React.MouseEvent<HTMLButtonElement>) =>
    {
        event.stopPropagation();

        // Check if cache has stored account data
        const accountData = Shared.requireCachedAccountData();

        // Set "removing" classname to file
        setFileRemoving(true);

        // Get recaptcha token
        Shared.executeWithRecaptcha("submit").then(token =>
        {
            // Send file remove request to server
            fetch(Shared.defaultPathsList.request, new Shared.RequestBody({
                [Requests.TypesList.Action]: Requests.ActionsList.removeFile,

                [Requests.TypesList.AccountLogin]: accountData.login,
                [Requests.TypesList.AccountHash]: accountData.hash,

                [Requests.TypesList.CaptchaToken]: token,

                [Requests.TypesList.FileName]: props.name + "." + props.extension,
                [Requests.TypesList.FileDate]: props.date
            }).postFormData).then(request => request.json())
                .then(result =>
                {
                    // If request is true, update files list
                    if (result.success == true) props.updateFilesList && props.updateFilesList();
                    else // ... if not, remove "removing" classname and log result
                    {
                        setFileRemoving(false);
                        console.warn(result);
                    }
                });
        });
    };

    const className = Shared.classNames("file-entry", { removing: fileRemoving });
    return <div className={ className } onClick={ props.onClick } ref={ reference }>
        <i className="icon"
           style={ { backgroundImage: `url("${ Shared.defaultPathsList.openExtensionIcon(props.extension) }")` } } />
        <div className="file-data">
            <span className="file-name">{ props.name.split("@").slice(1).join("@") }.{ props.extension }</span>
            <span className="file-size">{ Shared.convertFileSize(props.size) }</span>
        </div>
        <button className="remove-file" onClick={ removeFile }>
            { Shared.createBootstrapIcon("trash") }
        </button>
    </div>;
}
