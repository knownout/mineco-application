import React from "react";
import Header from "./header";
import { Route, Routes, useLocation } from "react-router-dom";
import TitlePage from "./renderers/title-page";
import NotFoundPage from "./renderers/not-found";
import { makeRoute, serverRoutesList } from "../lib/routes-list";
import MakeFormData from "../lib/make-form-data";
import { RequestOptions, Response } from "../lib/types/requests";
import { ItemObject } from "../control-panel/components/root-form/item-object-renderers/renderers";
import Loading from "../common/loading";
import MaterialPage from "./renderers/material-page";

function PagesRouter () {
    const location = useLocation();

    const identifier = location.pathname.split("/").slice(1).join("/");

    const [ response, setResponse ] = React.useState<Response<ItemObject.Material>>();

    React.useEffect(() => {
        fetch(makeRoute(serverRoutesList.getMaterial), new MakeFormData({
            [RequestOptions.getMaterial]: identifier
        }).fetchObject)
            .then(response => response.json())
            .then(response => {
                setResponse(response);
            });
    }, [ location ]);


    return <>
        <Loading display={ !response } />
        { (response && response.responseContent) ? <MaterialPage material={ response.responseContent } /> :
            <NotFoundPage /> }
    </>;
}

export default function ApplicationRouter (props: { children?: any }) {
    const [ scrollHeight, setScrollHeight ] = React.useState(0);

    const componentScrollHandler = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        setScrollHeight((event.target as HTMLDivElement).scrollTop);
    };

    return <div className="page-renderer ui container block scroll-y" onScroll={ componentScrollHandler } style={ {
        position: "relative",
        display: "block",

        height: "100%"
    } }>
        <Header scrollHeight={ scrollHeight } />

        <div className="page-content-data">
            <Routes>
                <Route path="/" element={ <TitlePage /> } />
                <Route path="*" element={ <PagesRouter /> } />
            </Routes>
        </div>
    </div>;
}