import React from "react";

export { default } from "./button";

/**
 * Custom properties for button component
 */
export interface ButtonProps {
    // Button text
    children: any;

    // Inline renders icon before button text
    // Will be hidden while performing async requests
    icon?: string;

    // Root element (button) class name
    className?: string;
    disabled?: boolean;

    element?: React.RefObject<HTMLButtonElement>;

    // Class name for button title (span) element
    spanClassName?: string;

    // Add-on over native onClick event
    onClick? (event: React.MouseEvent<HTMLButtonElement>): void;

    // Perform async requests on click
    onAsyncClick? (event: React.MouseEvent<HTMLButtonElement>): Promise<void>;

    // Error handler for async requests (catch alternative)
    onAsyncException? (exception?: any): void;
}

/**
 * Extended type for button component with native props support
 */
export type ExtendedButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonProps>
    & ButtonProps;
