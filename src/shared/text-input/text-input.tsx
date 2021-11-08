import React from "react";
import "./text-input.scss";
import { classNames } from "../shared-content";

interface ITextInputProps
{
    icon?: JSX.Element

    onReturn?: (value: string) => void;
    onInput?: (element: HTMLInputElement, value: string) => void

    type?: "text" | "tel" | "number" | "email" | "password"
    placeholder?: string
}

export default function TextInput (props: ITextInputProps) {
    const [ placeholderState, setPlaceholderState ] = React.useState(true);
    const inputElement = React.createRef<HTMLInputElement>();

    function onInput ()
    {
        if (!inputElement.current) return;
        const element = inputElement.current;

        const text = element.value.replace(/\s{2,}/g, " ").trimLeft();

        if (text.length > 0 && placeholderState) setPlaceholderState(false);
        else if (text.length < 1 && !placeholderState) setPlaceholderState(true);

        const caretPosition = (element.selectionStart || text.length);
        const offset = element.value.length - text.length;

        element.value = text;

        element.setSelectionRange(caretPosition - offset, caretPosition - offset);


        if (props.onInput) props.onInput(element, text);
    }

    function onKeyPress (event: React.KeyboardEvent<HTMLInputElement>)
    {
        if (event.key == "Enter" && props.onReturn && inputElement.current)
            props.onReturn(inputElement.current.value.trim());
    }

    const className = classNames("input-holder", { "active": placeholderState });

    return <div className="text-input" onClick={ () => inputElement.current && inputElement.current.focus() }>
        { props.icon && <div className="icon-holder">{ props.icon }</div> }

        <div className={ className }>
            { props.placeholder && <span className="placeholder">{ props.placeholder }</span> }
            <input type={ props.type || "text" } onInput={ onInput } ref={ inputElement }
                   onKeyPress={ onKeyPress } />
        </div>
    </div>;
}