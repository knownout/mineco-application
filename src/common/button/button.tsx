import React from "react";
import classNames from "../../lib/class-names";
import { ExtendedButtonProps } from "./index";
import "./button.scss";

/**
 * Custom button component with ability to perform async requests
 * with loading animation
 *
 * Uses ui-theme for styling
 *
 * @constructor
 */
export default function Button (props: ExtendedButtonProps) {
    const [ waiting, setWaiting ] = React.useState(false);

    // Separate native props from custom props
    const {
        children, icon, className, disabled, element,
        onClick, onAsyncClick, onAsyncException,
        ...nativeProps
    } = props;

    // Class name for root element (button)
    const rootClassName = classNames("ui interactive clean padding-20 border-radius-10 flex row center", {
        disabled: disabled || waiting, waiting
    }, props.className, "opacity-95 button-component");

    /**
     * Native click event handler
     * @inner
     *
     * @param event React MouseEvent
     */
    async function clickHandler (event: React.MouseEvent<HTMLButtonElement>) {
        // Execute common onClick event
        if (onClick) onClick(event);

        // If no async click function is specified, skip the async part
        if (!onAsyncClick) return;

        // Set loading animation and lock button
        setWaiting(true);

        // Wait for the asynchronous content to execute
        await onAsyncClick(event).catch(error => {
            // If an error handler is provided, use it
            if (onAsyncException) onAsyncException(error);

            // ... otherwise, warn about the exception in the console
            else {
                console.warn("Exception occurred while performing "
                    + "async request and no exception handler specified");

                console.warn(error);
            }
        });

        // Remove loading animation and unlock button
        setWaiting(false);
    }

    return <button className={ rootClassName } { ...nativeProps } onClick={ clickHandler } ref={ element }>
        <i className="ui loading-spinner dark opacity-85" />
        { icon && <i className={ classNames("button-icon", icon) } /> }
        <span className="text">{ children }</span>
    </button>;
}