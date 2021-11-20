import React from "react";
import { classNames, filterInputValue } from "../shared-content";
import "./input.scss";

interface IInputProps
{
    /** Icon for input element (at left) */
    icon?: JSX.Element

    /** Event fires after user pressed Enter key on current input */
    onReturn? (value: string): void

    /** Event fires when default onInput event of the input element fires */
    onInput? (value: string, element: HTMLInputElement): void

    /** Fires only when placeholder state changed */
    onPlaceholderStateChange? (state: boolean): void

    /** Type of the input element */
    type?: "text" | "tel" | "number" | "email" | "password" | string

    /** Placeholder for the input element */
    placeholder?: string

    /** Custom filters for the input, key is string that used to create regular expression via new RegExp object */
    filters?: { [key: string]: string }

    /** Initial value of the text input */
    defaultValue?: string

    /** Reference to native html input element */
    inputRef?: React.RefObject<HTMLInputElement>
}

/**
 * Simple text input component with support of different types and real-time value filters
 * @param props IInputProps
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function Input (props: IInputProps)
{
    const defaultValue = props.defaultValue && props.defaultValue.trim();

    const [ placeholder, _setPlaceholder ] = React.useState(!defaultValue);
    const [ focusState, setFocusState ] = React.useState(false);

    const setPlaceholder = (state: boolean) =>
    {
        _setPlaceholder(state);
        if (props.onPlaceholderStateChange) props.onPlaceholderStateChange(state);
    };

    const inputElement = props.inputRef || React.createRef<HTMLInputElement>();

    function onInput ()
    {
        // If no native input element, skip
        if (!inputElement.current) return;
        if (inputElement.current.parentElement && inputElement.current.value.trim().length > 0)
            inputElement.current.parentElement.classList.remove("active");

        // Get native input element shortcut
        const element = inputElement.current,
            text = filterInputValue(element, props.filters || {});

        if (text.length > 0 && placeholder && props.placeholder) setPlaceholder(false);
        else if (text.length < 1 && !placeholder && props.placeholder) setPlaceholder(true);

        if (props.onInput) props.onInput(text, element);
    }

    function onKeyPress (event: React.KeyboardEvent<HTMLInputElement>)
    {
        // If pressed key is Enter and onReturn callback provided, call it
        if (event.key == "Enter" && props.onReturn && inputElement.current)
            props.onReturn(inputElement.current.value.trim());
    }

    const className = classNames("input-holder", { "active": placeholder });
    const wrapperClassName = classNames("input", { "focus": focusState });

    return <div className={ wrapperClassName } onClick={ () => inputElement.current && inputElement.current.focus() }>
        {/* If icon provided, render it */ }
        { props.icon && <div className="icon-holder">{ props.icon }</div> }

        <div className={ className }>
            {/* If placeholder provided, render it */ }
            { props.placeholder && <span className="placeholder">{ props.placeholder }</span> }

            <input type={ props.type || "text" } onInput={ onInput } ref={ inputElement }
                   onKeyPress={ onKeyPress }
                   onFocus={ () => setFocusState(true) }
                   onBlur={ () => setFocusState(false) }
                   defaultValue={ props.defaultValue } />
        </div>
    </div>;
}

/** Text input filter presets */
export const FilterPreset = {
    /** Preset includes only: numbers, latin large and small letters and _ symbol */
    onlyLatin: { "\\s{2,}": " ", "[^A-Za-z0-9_]": "", "\\_{2,}": "_" },
    latinWithSymbols: { "\\s{2,}": " ", "[^A-Za-z0-9_@\\-]": "", "\\-{2,}": "-", "@{2,}": "@" },

    allDefault: {
        "\\s{2,}": " ", "[^A-Za-z0-9А-Яа-яЁё%$&*?)(!#№:+_@=,.\\- ]": "", "\\-{2,}": "-", "@{2,}": "@"
    }
};
