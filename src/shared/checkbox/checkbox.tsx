import React from "react";
import "./checkbox.scss";
import { classNames } from "../shared-content";

interface ICheckboxProps
{
    children: string

    /** Fires when checkbox state changed */
    onSwitch? (state: boolean): void

    /**
     * If false, checkbox (not whole component, just decorative checkbox entity)
     * will be hidden
     */
    displayCheckbox?: boolean

    className?: string

    /** Initial checkbox component state */
    defaultChecked?: boolean
}

/**
 * Simple checkbox component with
 * specific properties
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
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
        { props.displayCheckbox !== false && <div className="checkbox-box" /> }
        <span className="checkbox-label">{ props.children }</span>
    </button>;
}
