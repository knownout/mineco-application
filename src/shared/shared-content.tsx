// Library and helpers import
import React from "react";

import { MD5 } from "crypto-js";
// Context and cache data import
import { IAccountData, IHashedAccountData, Material, Requests } from "./shared-types";
import CacheController, { CacheKeys } from "./cache-controller";

// Shortcuts
import RequestResult = Requests.RequestResult;

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

    return text.trimEnd();
}

/**
 * React hook for force update a function components
 */
export function useForceUpdate ()
{
    const [ value, setValue ] = React.useState(false);
    return () => setValue(!value);
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
    public readonly name = "FetchError";

    constructor (public readonly message: string) {}
}

/**
 * Function for creating html elements from class names of the bootstrap icons
 * @param shortClassName name of the icon (without "bi bi-")
 */
export function createBootstrapIcon (shortClassName: string)
{
    return <i className={ `bi bi-${ shortClassName }` } />;
}

/**
 * Execute request with google recaptcha
 * @param action recaptcha action type
 */
export async function executeWithRecaptcha (action: "submit" | "login" | "homepage" | "social"): Promise<string>
{
    return new Promise(resolve =>
    {
        // @ts-ignore
        grecaptcha.ready(() =>
        {
            // @ts-ignore
            grecaptcha.execute("6Lf41iIdAAAAACNhIqTPtW6ynSo1RI5RP9-l9DHJ", { action }).then(resolve);
        });
    });
}

/**
 * Get stored account data from cache and request server for data verification
 * @param callback fired when request value retrieved
 */
export function verifyStoredAccountData (callback: (result: boolean) => void): Promise<void>
{
    const cacheController = new CacheController(window.localStorage);
    const initialAccountData = cacheController.fromCache<IAccountData>(CacheKeys.accountData);

    // Create new promise (for PageWrapper asyncContent property)
    return new Promise(resolve =>
    {

        // Shortcut for resolving promise
        const makeResolve = (result: boolean, innerCallback?: () => any) =>
        {
            resolve();
            if (innerCallback) innerCallback();
            return callback(result);
        };

        if (initialAccountData)
        {
            executeWithRecaptcha("login").then(token =>
            {
                // Send request to server
                fetch(defaultPathsList.request, new RequestBody({
                    [Requests.TypesList.Action]: Requests.ActionsList.verifyAccountData,
                    [Requests.TypesList.AccountLogin]: initialAccountData.login,
                    [Requests.TypesList.AccountHash]: MD5(initialAccountData.password),
                    [Requests.TypesList.CaptchaToken]: token
                }).postFormData).then(request => request.json()).then((result: RequestResult<IAccountData>) =>
                {
                    if (!result.success) makeResolve(false, () =>
                        cacheController.removeCachedContent(CacheKeys.accountData));

                    else makeResolve(true);

                    // (for security reasons) if server can not respond, reset account data
                }).catch(() =>
                    makeResolve(false, () =>
                        cacheController.removeCachedContent(CacheKeys.accountData))
                );
            }).catch(() => { throw new FetchError("Server cannot respond to this request"); });
        } else makeResolve(false);
    });
}

/**
 * Try to get hashed account data from cache and redirect
 * to auth page if data not found
 */
export function requireCachedAccountData (): IHashedAccountData
{
    const cacheController = new CacheController(window.localStorage);
    const accountData = cacheController.fromCache(CacheKeys.accountData) as IAccountData;

    if (!accountData)
    {
        window.location.href = defaultPathsList.contentManagementSystem;
        return {} as IHashedAccountData;
    }

    return { login: accountData.login, hash: MD5(accountData.password) };

}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function convertFileSize (bytes: number, si = false, dp = 1)
{
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh)
    {
        return bytes + " B";
    }

    const units = si
        ? [ "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ]
        : [ "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB" ];
    let u = -1;
    const r = 10 ** dp;

    do
    {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + " " + units[u];
}

/**
 * Convert object from type PreviewRaw to Preview
 *
 * @param rawMaterial raw material
 */
export function processRawMaterial (rawMaterial: Material.PreviewRaw)
{
    const { tags, pinned, time, ...rest } = rawMaterial;
    return {
        ...rest,
        tags: tags.split(",").map(item => item.trim()),
        time: Number.parseInt(time),
        pinned: pinned === "1"
    };
}

export function renderLocalizedDate (date: Date, renderTime: boolean = false)
{
    const monthsList = [
        "января", "февраля",
        "марта", "апреля", "мая",
        "июня", "июля", "августа",
        "сентября", "октября", "ноября",
        "декабря"
    ];

    let returnString = `${ date.getDay() } ${ monthsList[date.getMonth()] } ${ date.getFullYear() }`;
    if (renderTime) returnString += ` в ${ date.getHours() }:${ date.getMinutes() }`;

    return returnString;
}

/** Raw path to API server */
export const defaultServerPath = window.location.origin.replace(`:${ window.location.port }`, "");

/** List of paths to different API routes */
export const defaultPathsList = {
    request: defaultServerPath + "/request",
    openFile: defaultServerPath + "/request/open-file.php",

    /** CMS root path */
    contentManagementSystem: "/content-management-system",
    /** CMS auth path */
    contentManagementSystemAuth: "/content-management-system/auth",

    /** Generate path to file extension icon */
    openExtensionIcon: (icon: string) => defaultPathsList.openFile + "?extension_icon=" + icon,

    /** Generate path to file in user content storage */
    openStorageFile: (date: string, file: string, stub?: boolean) =>
        defaultPathsList.openFile + `?date=${ date }&file=${ file }` + (stub ? `&stub=true` : ``)
};
