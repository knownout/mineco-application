// Library import
import React from "react";
// Helpers import
import { Material, Requests } from "../shared-types";
import * as Shared from "../shared-content";
import { defaultPathsList, RequestBody } from "../shared-content";
// Internal components import
import PageWrapper from "../page-wrapper";
// Internal components for current scope import
import MaterialsList from "./materials-list/materials-list";
import MaterialsSearch from "./materials-search/materials-search";
// Shortcuts
import RequestResult = Requests.RequestResult;
// Stylesheet
import "./materials.scss";

namespace Materials
{
    export interface Properties
    {
        /** Requests processor (server) address */
        endpoint: string

        /** Custom filters for request */
        filters?: { [key: string]: Requests.ActionsList | string }
    }

    export interface State
    {
        /** List of currently loaded materials */
        materialsList: Material.LazyPreview[],

        /** Last search query (for updating articles after editor) */
        lastSearchQuery?: string
    }
}

/**
 * Component for display materials, searching through materials database
 * and creating new materials
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default class Materials extends React.PureComponent<Materials.Properties, Materials.State>
{
    state: Materials.State = { materialsList: [] };

    /**
     * Function for requiring materials from database
     *
     * @param filters list of custom request filters
     */
    private async requireMaterialsList (filters?: Materials.Properties["filters"])
    {
        const requestBody = new RequestBody(filters);

        // Append default request parameter
        requestBody.push({
            [Requests.TypesList.Action]: Requests.ActionsList.getMaterials
        });

        // If custom filters provided, append it (override) to the request body object
        if (filters) requestBody.push(filters);

        // If latest query exist, append it (override) to the request body object
        if (this.state.lastSearchQuery) requestBody.push({
            [Requests.TypesList.DataTitle]: this.state.lastSearchQuery,
            [Requests.TypesList.DataShort]: this.state.lastSearchQuery
        });

        // Get get raw materials list from server
        const rawMaterialsList: RequestResult<Material.PreviewRaw[]> =
            await fetch(this.props.endpoint, requestBody.postFormData)
                .then(response => response.json());

        if (!rawMaterialsList.success) throw new Shared.FetchError(rawMaterialsList.meta.toString());
        else
        {
            const materialsList = rawMaterialsList.meta.map(Shared.processRawMaterial);

            // Object for materialsList with preview image stub property
            const lazyMaterialsList: Material.LazyPreview[] = [];

            // Get date and filename from preview image name
            const getPreviewData = (material: Material.Preview) => material.preview
                .split("/") as [ string, string ];

            // Iterate through materials list
            for await (const material of materialsList)
            {
                const [ name, date ] = getPreviewData(material);

                // Path to preview image placeholder (stub)
                const source = Shared.defaultPathsList.openStorageFile(name, date, true);
                const lazyMaterial = {
                    ...material,

                    // Path to original preview image file
                    preview: Shared.defaultPathsList.openStorageFile(name, date),
                    stub: source
                } as Material.LazyPreview;

                // Wait until stub image loaded
                await new Promise<void>(resolve =>
                {
                    const image = document.createElement("img");

                    image.src = source;
                    image.onload = () => resolve();
                });

                lazyMaterialsList.push(lazyMaterial);
            }

            this.setState({ materialsList: lazyMaterialsList });
        }
    }

    /**
     * Fires when material in materials list get clicked
     * or when new material created
     *
     * @param material metadata or undefined if new material created
     */
    private materialEditHandler (material?: Material.LazyPreview)
    {
        const editorWindowProperties = "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no";
        const editorWindow = material
            ? window.open(defaultPathsList.contentManagementSystem + "/edit/" + material.identifier,
                "Редактор: " + material.title, editorWindowProperties)
            : window.open(defaultPathsList.contentManagementSystem + "/edit/new",
                "Редактор нового материала", editorWindowProperties);

        if (!editorWindow) return;
        editorWindow.onbeforeunload = () => this.requireMaterialsList();
    }

    render (): React.ReactNode
    {
        return <PageWrapper className="materials" asyncContent={ this.requireMaterialsList.bind(this) }>
            <MaterialsSearch requireMaterialsList={ searchQuery => new Promise<void>(resolve =>
                this.setState({ lastSearchQuery: searchQuery }, () => resolve(this.requireMaterialsList()))
            ) } onMaterialCreate={ this.materialEditHandler.bind(this) } />

            <MaterialsList materialsList={ this.state.materialsList }
                           onMaterialEditStart={ this.materialEditHandler.bind(this) } />
        </PageWrapper>;

    }
}