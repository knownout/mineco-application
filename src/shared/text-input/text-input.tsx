import React from "react";
import {classNames, filterInputValue} from "../shared-content";
import "./text-input.scss";

interface ITextInputProps {
    /** Icon for text-input element (at left) */
    icon?: JSX.Element

    /** Event fires after user pressed Enter key on current text-input */
    onReturn?(value: string): void

    /** Event fires when default onInput event of the text-input element fires */
    onInput?(value: string, element: HTMLInputElement): void

    /** Fires only when placeholder state changed */
    onPlaceholderStateChange?(state: boolean): void

    /** Type of the text-input element */
    type?: "text" | "tel" | "number" | "email" | "password" | string

    /** Placeholder for the text-input element */
    placeholder?: string

    /**
     * Custom filters for the text-input, key is string that used
     * to create regular expression via new RegExp object
     */
    filters?: { [key: string]: string }

    /** Initial value of the text text-input */
    defaultValue?: string

    /** Reference to native html text-input element */
    inputRef?: React.RefObject<HTMLInputElement>

    readonly?: boolean
}

/**
 * Simple text text-input component with support of
 * different types and real-time value filters
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function TextInput(props: ITextInputProps) {
    const defaultValue = props.defaultValue && props.defaultValue.trim();

    // Placeholder display state
    const [placeholder, _setPlaceholder] = React.useState(!defaultValue);

    // Component focus state
    const [focusState, setFocusState] = React.useState(false);

    // Update placeholder state
    const setPlaceholder = (state: boolean) => {
        _setPlaceholder(state);
        if (props.onPlaceholderStateChange) props.onPlaceholderStateChange(state);
    };

    // Reference to native input element
    const inputElement = props.inputRef || React.createRef<HTMLInputElement>();

    function onInput() {
        // If no native text-input element, skip
        if (!inputElement.current) return;
        if (inputElement.current.parentElement && inputElement.current.value.trim().length > 0)
            inputElement.current.parentElement.classList.remove("active");

        // Get native text-input element shortcut
        const element = inputElement.current,
            text = filterInputValue(element, props.filters || {});

        if (text.length > 0 && placeholder && props.placeholder) setPlaceholder(false);
        else if (text.length < 1 && !placeholder && props.placeholder) setPlaceholder(true);

        if (props.onInput) props.onInput(text, element);
    }

    function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        // If pressed key is Enter and onReturn callback provided, call it
        if (event.key == "Enter" && props.onReturn && inputElement.current)
            props.onReturn(inputElement.current.value.trim());
    }

    const className = classNames("input-holder", {"active": placeholder});
    const wrapperClassName = classNames("input", {"focus": focusState});

    return <div className={wrapperClassName} onClick={() => inputElement.current && inputElement.current.focus()}>
        {props.icon && <div className="icon-holder">{props.icon}</div>}

        <div className={className}>
            {props.placeholder && <span className="placeholder">{props.placeholder}</span>}

            <input type={props.type || "text"} onInput={onInput} ref={inputElement}
                   onKeyPress={onKeyPress}
                   onFocus={() => setFocusState(true)}
                   onBlur={() => setFocusState(false)}
                   defaultValue={props.defaultValue}
                   readOnly={props.readonly} />
        </div>
    </div>;
}

/** Filter presets for the TextInput component */
export const FilterPreset = {
    onlyLatin: {"\\s{2,}": " ", "[^A-Za-z0-9_]": "", "\\_{2,}": "_"},
    latinWithSymbols: {"\\s{2,}": " ", "[^A-Za-z0-9_@\\-]": "", "\\-{2,}": "-", "@{2,}": "@"},

    allDefault: {
        "\\s{2,}": " ", "[^A-Za-z0-9А-Яа-яЁё%$&*?)(!#№:+_@=,.\\- ]": "", "\\-{2,}": "-", "@{2,}": "@"
    }
};
