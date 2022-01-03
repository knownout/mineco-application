import React from "react";
import classNames from "../../lib/class-names";
import "./loading.scss";

/**
 * Component for creating fullscreen loaders
 *
 * @constructor
 */
export default function Loading (props: { children?: string, display: boolean }) {
    const rootClassName = classNames("loading-component ui container bg-gradient", {
        display: props.display
    });

    return <div className={ rootClassName }>
        <div className="ui content-wrapper padding">
            <i className={ classNames("ui loading-spinner", { big: !props.children }) } />
            { props.children && <span className="text">{ props.children }</span> }
        </div>
    </div>;
}