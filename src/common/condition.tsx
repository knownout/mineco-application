import React from "react";

export default function Condition (props: { children: any, condition: any }) {
    return Boolean(props.condition) ? props.children : null;
}