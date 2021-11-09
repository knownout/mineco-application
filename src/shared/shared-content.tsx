import React from "react";

/**
 * Function for processing class names from strings and objects
 *
 * Objects are a key-value pair, if the value is an expression and is true,
 * the key will be added as the class name.
 *
 * All undefined values will be skipped
 *
 * @param classNames string, object or undefined
 */
export function classNames (...classNames: (undefined | string | { [key: string]: boolean })[])
{
    const resultingClassNames: string[] = [];

    for (const className of classNames)
    {
        // If item is undefined, skip it
        if (!className) continue;

        // Process item as string or object
        if (typeof className === "string")
        {
            // ... if string, just push to array
            resultingClassNames.push(className);
        } else
        {
            // ... otherwise check the expressions and based on the
            // result add the keys to the resulting array
            Object.keys(className).forEach(key =>
            {
                if (className[key]) resultingClassNames.push(key);
            });
        }
    }

    return resultingClassNames.filter(e => e.length > 0).join(" ").trim();
}

/**
 * Function for filtrate input element value in realtime with saving caret position
 * @param input native input element
 * @param filters list of filters (key - string for RegExp object constructor)
 */
export function filterInputValue (input: HTMLInputElement, filters: { [key: string]: string })
{
    // Get value of the element
    let text = input.value;

    // Apply filters to retrieved value
    Object.keys(filters).forEach(key => text = text.replace(new RegExp(key, "gi"), filters[key]));

    // Trim left part of the result
    text = text.trimLeft();

    // Get current caret position (before value reset)
    const caretPosition = (input.selectionStart || text.length),

        // Calculate caret offset
        offset = input.value.length - text.length;

    // Reset element value
    input.value = text;

    // Reset caret position
    input.setSelectionRange(caretPosition - offset, caretPosition - offset);

    return text.trim();
}

/**
 * Facilitate creation and management of the FormData objects
 */
export class RequestBody
{
    private formDataObject = new FormData();

    /**
     * Append list of entries to the FormData object
     *
     * Supports file append
     *
     * @param entries list of entries that will be added to FormData object
     */
    private appendEntries (entries: { [key: string]: any })
    {
        Object.keys(entries).forEach(key =>
        {
            let entry = entries[key];

            // If key not File instance, convert it to string
            if (!(entry instanceof File)) entry = entry.toString();

            this.formDataObject.append(key, entry);
        });
    }

    constructor (entries?: { [key: string]: any }) { if (entries) this.push(entries); }

    /**
     * Push (append) list of entries to the FormData object
     * @param entries list of entries
     */
    public push = (entries: { [key: string]: any }) => this.appendEntries(entries);

    /**
     * Remove keys from FormData object
     * @param keys list of keys to be removed
     */
    public remove = (...keys: string[]) => keys.forEach(key => this.formDataObject.delete(key));

    /**
     * Get original FormData object
     */
    public get formData ()
    {
        return this.formDataObject;
    }

    /**
     * Get an object to pass it to fetch-like functions as a request parameters
     */
    public get postFormData ()
    {
        return {
            body: this.formDataObject,
            method: "POST"
        };
    }
}

/**
 * Error type for throwing when fetch failed (RequestResult success option is false, as example)
 */
export class FetchError
{
    constructor (public readonly message: string) {}
}

export function createBootstrapIcon (shortClassName: string)
{
    return <i className={ `bi bi-${ shortClassName }` } />;
}

/** Raw path to API server */
export const defaultServerPath = window.location.origin.replace(`:${ window.location.port }`, "") + "/";

/** List of paths to different API routes */
export const defaultPathsList = {
    request: defaultServerPath + "request"
};
