import React from "react";

import Input from "../../../common/input";
import commonMasks from "../../../common/input/common-masks";
import InlineSearch from "../../../lib/inline-search";
import MakeFormData from "../../../lib/make-form-data";

import { appRoutesList, makeRoute, serverRoutesList } from "../../../lib/routes-list";

import {
    FileSearchOptions, MaterialSearchOptions, RequestOptions, Response, VariableOptions
} from "../../../lib/types/requests";
import useRecaptcha from "../../../lib/use-recaptcha";

import { FileRenderer, ItemObject, MaterialRenderer, VariableRenderer } from "./item-object-renderers/renderers";

export interface ItemsListProps
{
    type: ItemObject.Type;
    waitContent: boolean;
    selectedItem?: number;

    contentVersion?: number;
    extensionFiler?: string[];

    setWaitContent? (waitContent: boolean): void;

    updateItemsList? (itemsList: ItemObject.Unknown[]): void;

    resetSelectedItem? (): void;

    onItemClick? (index: number): void;

    raw_updateSelectedItem? (index: number): void;
}

/**
 * Component for creating items list with search
 * @internal
 *
 * @constructor
 */
export default function ItemsList (props: ItemsListProps) {
    let initialIdentifier = window.location.pathname.split("/")
        .map(e => e.trim()).filter(e => e.length > 0)[1];

    const [ searchQuery, _setSearchQuery ] = React.useState<string | undefined>(initialIdentifier
        ? "#" + initialIdentifier : undefined);

    const [ itemsList, setItemsList ] = React.useState<ItemObject.Unknown[]>();

    const setSearchQuery = (value: string) => {
        if (props.resetSelectedItem) props.resetSelectedItem();
        _setSearchQuery(value);
    };

    // Require fresh items list when searchQuery updated
    React.useEffect(() => {
        // Enable content waiting mode for the parent component
        if (props.setWaitContent) props.setWaitContent(true);

        if (initialIdentifier === undefined) {
            const location = window.location.pathname.split("/").map(e => e.trim()).filter(e => e.length > 0);
            if (location.length > 1) {
                _setSearchQuery(`#` + location[1]);
            }
        }

        // Get recaptcha client token
        useRecaptcha().then(token => {
            const formData = new MakeFormData({
                [RequestOptions.recaptchaToken]: token,
                [RequestOptions.limitSearchResponse]: 30
            });

            // Get special requests from the search query string
            const inlineSearchEntries = [
                {
                    datetimeFrom: [ />\d{2}\/\d{2}\/\d{4}/, ">" ],
                    datetimeTo: [ /<\d{2}\/\d{2}\/\d{4}/, "<" ],
                    identifier: [ /#[a-z0-9\-]+/, "#" ],
                    tags: [ /\+[A-Za-z0-9А-Яа-яЁё]+/g, "+" ],
                    excludeTags: [ /-[A-Za-z0-9А-Яа-яЁё]+/g, "-" ],
                    title: [ /!.+/, "!" ]
                },
                {
                    datetimeFrom: [ />\d{2}\.\d{2}\.\d{4}/, ">" ],
                    datetimeTo: [ /<\d{2}\.\d{2}\.\d{4}/, "<" ],
                    identifier: [ /#[a-z0-9\-]+/, "#" ],
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
                    VariableOptions.variableName
                ][props.type]]: inlineSearch.searchQuery
            });

            // Select request names provider based on the item type
            const optionsObject = [ MaterialSearchOptions, FileSearchOptions, VariableOptions ][props.type];

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

                    props.updateItemsList && props.updateItemsList(response.responseContent as ItemObject.Unknown[]);
                    setItemsList(response.responseContent as ItemObject.Unknown[]);

                    if (response.responseContent && response.responseContent.length > 0 && props.raw_updateSelectedItem
                        && initialIdentifier) {
                        window.history.replaceState(null, document.title, appRoutesList.cms);

                        if (response.responseContent[0] && response.responseContent[0].identifier == initialIdentifier)
                            props.raw_updateSelectedItem(0);
                    }
                }).finally(() => props.setWaitContent && props.setWaitContent(false));
        });
    }, [ searchQuery, props.contentVersion, initialIdentifier ]);

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
                                          onClick={ () => props.onItemClick && props.onItemClick(index) } />,

                        <FileRenderer { ...item as ItemObject.File } key={ index } filter={ props.extensionFiler }
                                      selected={ index == props.selectedItem }
                                      onClick={ () => props.onItemClick && props.onItemClick(index) } />,

                        <VariableRenderer { ...item as ItemObject.Variable } key={ index }
                                          selected={ index == props.selectedItem }
                                          onClick={ () => props.onItemClick && props.onItemClick(index) } />
                    ][props.type];
                }) }
            </div>
        </div>
    </div>;
}
