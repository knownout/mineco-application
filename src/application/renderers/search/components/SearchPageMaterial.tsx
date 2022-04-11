/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React from "react";
import { ItemObject } from "../../../../control-panel/components/root-form/item-object-renderers/renderers";
import transliterate from "../../../../lib/transliterate";
import { RawMaterialRenderer, useMaterialData } from "../../material/material";

export default function SearchPageMaterial (props: { tag?: string }) {
    const tag = props.tag || "search";
    const [ material, setMaterial ] = React.useState<ItemObject.FullMaterial>();

    useMaterialData({
        setMaterial,
        identifier: transliterate(tag).toLowerCase()
    });

    return <>
        { material && <RawMaterialRenderer material={ material } strict={ true } /> }
    </>;
}
