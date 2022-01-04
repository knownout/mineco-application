import React from "react";
import "./input.scss";
import classNames from "../../lib/class-names";
import { ExtendedInputProps, useMask } from "./index";

/**
 * Custom input component with ability of applying input masks and
 * native properties support
 *
 * @constructor
 */
export default function Input (props: ExtendedInputProps) {
    // Focus state, changes when onBlur or onFocus events get fired
    const [ [ focusState, setFocusState ], [ valueState, setValueState ] ] = [
        React.useState(false),
        React.useState(false)
    ];

    // Separate native props from custom props
    const {
        icon, mask, placeholder, children, disabled, className, element,
        onInput, onFocusChange, onKeyPress, onReturn,
        ...nativeProps
    } = props;

    // Class name of the component root element (div)
    const rootClassName = classNames("input-component ui flex row no-wrap gap", {
        disabled,
        focus: focusState,
        value: valueState
    }, props.className);

    /**
     * Focus change event handler, fires with the onFocus
     * and onBlur native events
     *
     * @param event React FocusEvent
     */
    function focusChangeHandler (event: React.FocusEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement,
            focus = event.type === "focus";

        if (focus) setFocusState(true);
        else setFocusState(false);

        if (props.onFocusChange) props.onFocusChange(focus, target, event);
    }

    /**
     * onInput native event handler
     *
     * @param event React FormEvent
     */
    function inputHandler (event: React.FormEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;

        // Apply masks only if event has key data (avoid masks apply if backspace pressed)
        if (props.mask && (event.nativeEvent as InputEvent).data) props.mask.forEach(mask => {
            useMask(mask, target);
        });

        if (props.onInput) props.onInput(target.value, target, event);
        setValueState(target.value.length > 0);
    }

    /**
     * onKeyPress native event handler, also fires onReturn custom event
     * when Enter (Return) key pressed
     *
     * @param event React KeyboardEvent
     */
    function keyPressHandler (event: React.KeyboardEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        if (props.onReturn && event.key === "Enter") props.onReturn(target.value, target, event);

        if (props.onKeyPress) props.onKeyPress(event.key, target, event);
    }

    return <div className={ rootClassName }>
        { icon && <div className="icon-holder ui grid center fz-24 border-radius-10"
                       children={ <i className={ icon } /> } /> }

        <div className="wrapper ui border-radius-10">
            { placeholder && <div className="placeholder ui padding-20 border-radius-10">{ placeholder }</div> }
            <input type="text" className="native-input ui padding-20 border-radius-10 clean" { ...nativeProps }
                   onFocus={ focusChangeHandler } onBlur={ focusChangeHandler }
                   onInput={ inputHandler } onKeyPress={ keyPressHandler }
                   defaultValue={ children } ref={ element }
            />
        </div>
    </div>;
}