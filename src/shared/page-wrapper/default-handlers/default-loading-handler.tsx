import React from "react";

/**
 * Default loading handler of the PageWrapper component
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function DefaultLoadingHandler (props: { loadingLabel?: string })
{
    return (
        <div className="default-loading-handler">
            <div className="loading-spinner" />
            <span className="loading-label">{ props.loadingLabel || "Загрузка страницы" }</span>
        </div>
    );
}
