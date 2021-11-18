import React from "react";
import "./checkbox.scss";
import { classNames } from "../shared-content";

interface ICheckboxProps
{
    children: string

    onSwitch? (state: boolean): void

    className?: string

    defaultChecked?: boolean
}

export default function Checkbox (props: ICheckboxProps)
{
    const [ checked, setChecked ] = React.useState(Boolean(props.defaultChecked));

    const className = classNames("checkbox", props.className, { checked });
    const clickEventHandler = () =>
    {
        const nextState = !checked;
        setChecked(nextState);

        if (props.onSwitch) props.onSwitch(nextState);
    };

    return <button className={ className } onClick={ clickEventHandler }>
        <div className="checkbox-box" />
        <span className="checkbox-label">{ props.children }</span>
    </button>;
}
