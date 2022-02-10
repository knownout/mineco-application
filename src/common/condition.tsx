import React from "react";

export default function Condition (props: { children: any, condition: any }) {
    return props.condition && props.children;
}