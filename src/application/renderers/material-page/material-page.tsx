import React from "react";
import "./material-page.scss";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";

export default function MaterialPage (props: { material: ItemObject.Material }) {
    console.log(props.material);

    return null;
}