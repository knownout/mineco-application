import React from "react";
import "./text-input.scss";
import { classNames, filterInputValue } from "../shared-content";

interface ITextInputProps
{
    /** Icon for input element (at left) */
    icon?: JSX.Element

    /** Event fires after user pressed Enter key on current input */
    onReturn?: (value: string) => void;

    /** Event fires when default onInput event of the input element fires */
    onInput?: (element: HTMLInputElement, value: string) => void

    /** Type of the input element */
    type?: "text" | "tel" | "number" | "email" | "password"

    /** Placeholder for the input element */
    placeholder?: string

    /** custom filters for the input, key is string that used to create regular expression via new RegExp object */
    filters?: { [key: string]: string }
}

/**
 * Simple text input component with support of different types and real-time value filters
 * @param props ITextInputProps
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function TextInput (props: ITextInputProps)
{
    // Placeholder visibility state
    const [ placeholder, setPlaceholder ] = React.useState(true);

    // Reference to native input element
    const inputElement = React.createRef<HTMLInputElement>();

    // Wrapper for the native input event
    function onInput ()
    {
        // If no native input element, skip
        if (!inputElement.current) return;

        // Get native input element shortcut
        const element = inputElement.current,
            text = filterInputValue(element, props.filters || {});

        // Determine new placeholder state and update it, if changed
        if (text.length > 0 && placeholder) setPlaceholder(false);
        else if (text.length < 1 && !placeholder) setPlaceholder(true);

        // Call onInput function from properties, if provided
        if (props.onInput) props.onInput(element, text);
    }

    // Wrapper for the native keyPress event
    function onKeyPress (event: React.KeyboardEvent<HTMLInputElement>)
    {
        // If pressed key is Enter and onReturn callback provided, call it
        if (event.key == "Enter" && props.onReturn && inputElement.current)
            props.onReturn(inputElement.current.value.trim());
    }

    // Get classname for input element holder
    const className = classNames("input-holder", { "active": placeholder });

    return <div className="text-input" onClick={ () => inputElement.current && inputElement.current.focus() }>
        {/* If icon provided, render it */ }
        { props.icon && <div className="icon-holder">{ props.icon }</div> }

        <div className={ className }>
            {/* If placeholder provided, render it */ }
            { props.placeholder && <span className="placeholder">{ props.placeholder }</span> }

            <input type={ props.type || "text" } onInput={ onInput } ref={ inputElement }
                   onKeyPress={ onKeyPress } />
        </div>
    </div>;
}

/** Text input filter presets */
export const FilterPreset = {
    /** Preset includes only: numbers, latin large and small letters and _ symbol */
    onlyLatinWithoutSymbols: { "\s{2,}": " ", "[^A-Za-z0-9_]": "", "\_{2,}": "_" }
};
