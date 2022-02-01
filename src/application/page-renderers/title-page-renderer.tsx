import React from "react";

import { makeRoute, serverRoutesList } from "../../lib/routes-list";
import { MaterialSearchOptions, RequestOptions, Response, VariableOptions } from "../../lib/types/requests";
import MakeFormData from "../../lib/make-form-data";

import { ItemObject } from "../../control-panel/components/root-form/item-object-renderers/renderers";

import Loading from "../../common/loading";
import Header from "../header";

import "./page-renderers.scss";

interface TitlePageRendererProps {
    navigationMenu: { [key: string]: { [key: string]: string } };
}

/**
 * Title page renderer state
 */
interface TitlePageRendererState {
    // Is page loading
    loading: boolean;

    // Page loading error
    error?: any;

    // List of the latest materials to be displayed
    materialsList?: ItemObject.Material[];

    // Pinned material
    pinnedMaterial?: ItemObject.Material;

    // Important data from the database
    importantData?: string;
}

export default class TitlePageRenderer extends React.PureComponent<TitlePageRendererProps, TitlePageRendererState> {
    public readonly state: TitlePageRendererState = {
        loading: true
    };

    async componentDidMount () {
        async function require<T = ItemObject.Material[]> (path: string, options: { [key: string]: string }) {
            return await fetch(makeRoute(path), new MakeFormData(options).fetchObject)
                .then(response => response.json()) as Response<T>;
        }

        // Get pinned material from database if exist
        const pinnedMaterialResponse = await require(serverRoutesList.searchMaterials,
            { [MaterialSearchOptions.pinned]: "1" });

        // Get list of the latest materials
        const materialsListResponse = await require(serverRoutesList.searchMaterials,
            {
                [MaterialSearchOptions.pinned]: "0",
                [MaterialSearchOptions.tags]: "Новости",
                [RequestOptions.limitSearchResponse]: "10"
            });

        // Get important data
        const importantDataResponse = await require<ItemObject.Variable[]>(serverRoutesList.searchVariables,
            { [VariableOptions.variableName]: "Важная информация" });

        // Check if materials, important data and navigation menu items list exist
        if (!materialsListResponse.responseContent || !importantDataResponse.responseContent)
            return this.setState({ error: materialsListResponse.errorCodes?.join(" ") });

        const materialsList = materialsListResponse.responseContent;
        const pinnedMaterial = pinnedMaterialResponse.responseContent
            ? pinnedMaterialResponse.responseContent[0]
            : materialsList.shift();

        try {
            this.setState({
                pinnedMaterial,
                materialsList,

                importantData: importantDataResponse.responseContent[0].value as string,
                // Try to parse nav menu items

                loading: false
            });
        } catch {
            this.setState({ error: "invalid-variable" });
        }
    }

    render () {
        return <div className="ui container title-page">
            <Loading display={ this.state.loading } error={ this.state.error } />
            { this.props.navigationMenu && <Header navigationMenu={ this.props.navigationMenu } /> }
        </div>;
    }
}