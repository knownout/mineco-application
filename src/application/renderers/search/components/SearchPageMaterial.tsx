import React from "react";
import { ItemObject } from "../../../../control-panel/components/root-form/item-object-renderers/renderers";
import transliterate from "../../../../lib/transliterate";
import { useMaterialData } from "../../material/material";

export default function SearchPageMaterial (props: { tag?: string }) {
    const tag = props.tag || "search";
    const [ material, setMaterial ] = React.useState<ItemObject.FullMaterial>();

    useMaterialData({
        setMaterial,
        identifier: transliterate(tag).toLowerCase()
    });

    return <>
        {material && "Material loaded"}
    </>;
}
