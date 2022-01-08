import React from "react";

import Input from "../../../common/input";
import commonMasks from "../../../common/input/common-masks";

import { makeRoute, serverRoutesList } from "../../../lib/routes-list";
import useRecaptcha from "../../../lib/use-recaptcha";
import MakeFormData from "../../../lib/make-form-data";
import InlineSearch from "../../../lib/inline-search";

import { FileRenderer, ItemObject, MaterialRenderer, VariableRenderer } from "./item-object-renderers/renderers";

import {
    FileSearchOptions,
    MaterialSearchOptions,
    RequestOptions,
    Response,
    VariableSearchOptions
} from "../../cms-types/requests";

export interface ItemsListProps {
    type: ItemObject.Type;
    waitContent: boolean;
    selectedItem: number;

    contentVersion: number;

    setWaitContent (waitContent: boolean): void;

    updateItemsList (itemsList: ItemObject.Unknown[]): void;

    onItemClick (index: number): void;
}

/**
 * Component for creating items list with search
 * @internal
 *
 * @constructor
 */
export default function ItemsList (props: ItemsListProps) {
    const [ searchQuery, setSearchQuery ] = React.useState<string>();
    const [ itemsList, setItemsList ] = React.useState<ItemObject.Unknown[]>();

    // Require fresh items list when searchQuery updated
    React.useEffect(() => {
        // Enable content waiting mode for the parent component
        props.setWaitContent(true);

        // Get recaptcha client token
        useRecaptcha().then(token => {
            const formData = new MakeFormData({
                [RequestOptions.recaptchaToken]: token,
                [RequestOptions.limitSearchResponse]: 30
            });

            // Get special requests from the search query string
            const inlineSearchEntries = [
                {
                    datetimeFrom: [ />\d{2}\.\d{2}\.\d{4}/, ">" ],
                    datetimeTo: [ /<\d{2}\.\d{2}\.\d{4}/, "<" ],
                    identifier: [ /#[a-z0-9]+/, "#" ],
                    tags: [ /\+[A-Za-z0-9А-Яа-яЁё]+/g, "+" ],
                    title: [ /!.+/, "!" ]
                },
                {
                    datetimeFrom: [ />\d{2}\.\d{2}\.\d{4}/, ">" ],
                    datetimeTo: [ /<\d{2}\.\d{2}\.\d{4}/, "<" ],
                    identifier: [ /#[a-z0-9]+/, "#" ],
                    extension: [ /\+[a-z0-9A-Z]+/, "+" ]
                },
                {}
            ] as { [key: string]: [ RegExp, string ] }[];

            const inlineSearch = new InlineSearch(searchQuery || "")
                .getEntriesList(inlineSearchEntries[props.type]);

            // Add common search query string (already processed)
            formData.add({
                [[
                    MaterialSearchOptions.content,
                    FileSearchOptions.filename,
                    VariableSearchOptions.variableName
                ][props.type]]: inlineSearch.searchQuery
            });

            // Select request names provider based on the item type
            const optionsObject = [ MaterialSearchOptions, FileSearchOptions, VariableSearchOptions ][props.type];

            Object.entries(inlineSearch.entries).forEach(([ name, value ]) => {
                let outputValue = value.join(",");
                if (name.toLowerCase().includes("datetime") && outputValue.length > 0)
                    outputValue = (new Date(outputValue).getTime() / 1000).toString();

                formData.add({
                    [optionsObject[name as keyof typeof optionsObject]]: outputValue
                });
            });

            // Select endpoint based on the item type
            const routesList = [
                serverRoutesList.searchMaterials,
                serverRoutesList.searchFiles,
                serverRoutesList.searchVariables
            ][props.type];

            // Send POST request to the selected endpoint
            fetch(makeRoute(routesList), formData.fetchObject)
                .then(response => response.json()).catch(() => setItemsList(undefined))
                .then((response: Response<ItemObject.Unknown[]>) => {
                    if (!response.success) return setItemsList(undefined);

                    props.updateItemsList(response.responseContent as ItemObject.Unknown[]);
                    setItemsList(response.responseContent as ItemObject.Unknown[]);
                }).finally(() => props.setWaitContent(false));
        });
    }, [ searchQuery, props.contentVersion ]);

    return <div className="items-list ui flex column scroll">
        <Input placeholder={ "Поиск " + [ "материалов", "файлов", "переменных" ][props.type] }
               icon={ "bi bi-" + [ "newspaper", "archive-fill", "percent" ][props.type] }
               mask={ [ commonMasks.latinCyrillicWithSymbols ] } onReturn={ setSearchQuery }
               spellCheck={ false }
        />

        <span className="ui fz-14 opacity-65 margin optimize">
            Без поискового запроса отображается только 30 последних элементов
        </span>

        <div className="entries-list">
            <div className="entries-wrapper ui flex column">
                { !itemsList && <span className="ui opacity-75">Ничего не найдено</span> }
                { itemsList && itemsList.map((item, index) => {
                    return [
                        <MaterialRenderer { ...item as ItemObject.Material } key={ index }
                                          selected={ index == props.selectedItem }
                                          onClick={ () => props.onItemClick(index) } />,

                        <FileRenderer { ...item as ItemObject.File } key={ index }
                                      selected={ index == props.selectedItem }
                                      onClick={ () => props.onItemClick(index) } />,

                        <VariableRenderer { ...item as ItemObject.Variable } key={ index }
                                          selected={ index == props.selectedItem }
                                          onClick={ () => props.onItemClick(index) } />
                    ][props.type];
                }) }
            </div>
        </div>
    </div>;
}