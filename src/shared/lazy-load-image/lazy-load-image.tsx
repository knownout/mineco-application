import React from "react";
import { classNames } from "../shared-content";

import "./lazy-load-image.scss";

interface IImageProps
{
    source: string
    placeholder: string

    onLoaded? (): void

    onPlaceholderLoaded? (): void

    className?: string
    alt?: string
}

/**
 * Image lazy loading component with placeholder
 * (same image but with less quality)
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function Image (props: IImageProps)
{
    return <figure className={ classNames("lazy-load-image", props.className) }>
        <img src={ props.placeholder } onLoad={ props.onPlaceholderLoaded } alt={ props.alt || "" }
             className="placeholder" />

        <img src={ props.source } onLoad={ props.onLoaded } alt={ props.alt || props.source } className="image" />
    </figure>;
}