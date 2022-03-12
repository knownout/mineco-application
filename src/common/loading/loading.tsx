import React from "react";
import { Link } from "react-router-dom";
import classNames from "../../lib/class-names";
import Button from "../button";
import "./loading.scss";

interface LoadingProps
{
    children?: string;
    error?: any;

    display: boolean;

    errorHandlerProxy? (error: any, defaultErrorForm: JSX.Element): JSX.Element;
}

/**
 * Component for creating fullscreen loaders
 *
 * @constructor
 */
export default function Loading (props: LoadingProps) {
    const rootClassName = classNames("loading-component ui container", {
        display: props.display,
        error: Boolean(props.error)
    });

    const defaultErrorForm =
        <div className="error-form ui flex column limit-380">
            <span className="ui title margin optimize">Произошла ошибка</span>
            <span className="ui sub-title margin optimize">
                Попробуйте немного подождать и перезагрузить страницу. Если данная ошибка появляется снова, обратитесь
                к администратору
            </span>
            <span className="error-text ui opacity-50 margin optimize">{ (typeof props.error === "object"
                && "message" in props.error)
                ? props.error.message
                : String(props.error) }
            </span>
            <Link to="/" className="ui clean margin optimize">
                <Button icon="bi bi-house-fill" className="w-fit">На главную</Button>
            </Link>
        </div>;

    const errorForm = props.errorHandlerProxy ? props.errorHandlerProxy(props.error, defaultErrorForm)
        : defaultErrorForm;

    return <div className={ rootClassName }>
        <div className="ui content-wrapper padding grid center">
            { !props.error && <i className={ classNames("ui loading-spinner", { big: !props.children }) } /> }
            { !props.error && props.children && <span className="text">{ props.children }</span> }
            { props.error && errorForm }
        </div>
    </div>;
}

/**
 * Component for creating loaders that fits in the parent element
 *
 * @constructor
 */
export function LoadingWrapper (props: { display: boolean }) {
    const rootClassName = classNames("loading-wrapper ui grid center", { display: props.display });

    return <div className={ rootClassName }>
        <i className="ui loading-spinner" />
    </div>;
}
