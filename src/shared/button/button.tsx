import React from "react";

import { classNames } from "../shared-content";

import "./button.scss";

interface IButtonProps
{
    /** Synchronous click event (working same as native onClick event) */
    onClick? (event: React.MouseEvent<HTMLButtonElement>): void

    /** Asynchronous click event (button will wait until function resolves) */
    onAsyncClick? (event: React.MouseEvent<HTMLButtonElement>): Promise<any>

    children: string

    className?: string

    /** Reference to native HTMLButtonElement */
    reference?: React.Ref<HTMLButtonElement>

    disabled?: boolean

    /** Icon for the button (renders before label) */
    icon?: JSX.Element;
}

/**
 * Simple button with support of async data loading and error animation
 * @param props IButtonProps
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function Button (props: IButtonProps)
{
    const [ loadingState, setLoadingState ] = React.useState(false);
    const [ exception, setException ] = React.useState(false);

    async function onClickEvent (event: React.MouseEvent<HTMLButtonElement>)
    {
        setLoadingState(true);

        if (props.onClick) props.onClick(event);
        if (props.onAsyncClick) await props.onAsyncClick(event);
    }

    const buttonClassName = classNames("button-component", {
        "loading": loadingState,
        "exception": exception
    }, props.className);

    // Execute async function in synchronous context
    const buttonClickFunction = (event: React.MouseEvent<HTMLButtonElement>) => onClickEvent(event)

        // Catch rejections (will not catch throw inside event)
        .catch(error =>
        {
            console.error("Failed to execute onAsyncClick event:", error)

            setException(true);
            setTimeout(() => setException(false), 400);
        })

        // Remove loading state from button
        .finally(() => setLoadingState(false));

    return <button className={ buttonClassName } onClick={ buttonClickFunction } ref={ props.reference }
                   disabled={ props.disabled }>

        <div className="loading-spinner" />
        <div className="button-label">
            { props.icon }
            <span className="label">{ props.children }</span>
        </div>
    </button>;
}
