import React from "react";
import classNames from "../../lib/class-names";
import "./loading.scss";

/**
 * Component for creating fullscreen loaders
 *
 * @constructor
 */
export default function Loading (props: { children?: string, display: boolean, error?: any }) {
    const rootClassName = classNames("loading-component ui container bg-gradient", {
        display: props.display,
        error: Boolean(props.error)
    });

    return <div className={ rootClassName }>
        <div className="ui content-wrapper padding">
            { !props.error && <i className={ classNames("ui loading-spinner", { big: !props.children }) } /> }
            { !props.error && props.children && <span className="text">{ props.children }</span> }
            { props.error && <div className="error-form ui flex column color-white limit-380">
                <span className="ui title margin optimize">
                    Произошла ошибка
                </span>
                <span className="ui sub-title margin optimize">
                    Попробуйте немного подождать и перезагрузить страницу. Если данная ошибка появляется снова, обратитесь
                    к администратору
                </span>
                <span className="error-text ui opacity-50 margin optimize">{ "message" in props.error
                    ? props.error.message
                    : String(props.error) }</span>
            </div> }
        </div>
    </div>;
}