// Library import
import React from "react";
// Helpers import
import { FilterPreset } from "../../../../shared/text-input/text-input";
import { createBootstrapIcon } from "../../../../shared/shared-content";
import { Material } from "../../../../shared/shared-types";
// Internal components import
import TextInput from "../../../../shared/text-input";
import Button from "../../../../shared/button";
// Stylesheet
import "./materials-search.scss";

interface IMaterialsSearchProps
{
    /** Component will call this function when search button clicked */
    requireMaterialsList (searchQuery: string): Promise<void>

    /** Fires when material create button clicked */
    onMaterialCreate (material?: Material.Preview): void
}

/**
 * Materials search component for searching materials in database
 * using custom request filters
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function MaterialsSearch (props: IMaterialsSearchProps)
{
    const [ searchQuery, setSearchQuery ] = React.useState("");
    const buttonReference = React.createRef<HTMLButtonElement>();

    const onInputReturn = () =>
    {
        if (!buttonReference.current) return;
        buttonReference.current.click();
    };

    return <div className="materials-search">
        <TextInput filters={ FilterPreset.allDefault } icon={ createBootstrapIcon("binoculars-fill") }
                   placeholder="Заголовок или краткое содержание"
                   onInput={ setSearchQuery }
                   onReturn={ onInputReturn } />

        <Button onAsyncClick={ () => props.requireMaterialsList(searchQuery) } reference={ buttonReference }>
            Поиск
        </Button>
        <Button icon={ createBootstrapIcon("plus-square-fill") } onClick={ () => props.onMaterialCreate() }>
            Создать
        </Button>
    </div>;
}
