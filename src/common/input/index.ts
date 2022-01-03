import React from "react";

export { default } from "./input";

/**
 * Type for the input component masks
 */
export type InputMask = [ RegExp, string ];

/**
 * Custom props for the input component
 */
export interface InputProps<T = HTMLInputElement> {
    // Inline render icon to the side of the input component
    icon?: string;

    // Apply masks to the input value
    mask?: InputMask[];

    placeholder?: string;

    // Default value for native input element (cannot be used dynamically)
    children?: string;

    disabled?: boolean;

    // Class name of the root component element
    className?: string;

    // Add-on over native onInput event
    onInput? (value: string, element: T, event: React.FormEvent<T>): void;

    // Fires when onBlur or onFocus events get fired
    onFocusChange? (focusState: boolean, element: T, event: React.FocusEvent<T>): void;

    // Add-on over native onKeyPress event
    onKeyPress? (key: string, element: T, event: React.KeyboardEvent<T>): void;

    // Fires when Enter (Return) key pressed
    onReturn? (value: string, element: T, event: React.KeyboardEvent<T>): void;
}

/**
 * Extended properties for the input component with native props support
 */
export type ExtendedInputProps = Omit<React.HTMLProps<HTMLInputElement>, keyof InputProps> & InputProps;

/**
 * Dynamically apply masks to the input component value
 * @param mask array of regular expression and replacer
 * @param input native input element
 */
export function useMask (mask: InputMask, input: HTMLInputElement) {
    // Get start caret position
    let caret = input.selectionStart || 0;

    // Virtually apply masks to the input value
    const nextValue = input.value.trimLeft().replace(mask[0], mask[1]);

    // Calculate new caret position
    caret += nextValue.length - input.value.length;

    // Apply new input value
    input.value = nextValue;

    // Update caret position
    input.setSelectionRange(caret, caret);
}