import React from "react";

import { Route, Routes } from "react-router-dom";
import GenericForms from "./generic-forms";

const TitlePage = React.lazy(() => import("./title-page"));
const SearchRenderer = React.lazy(() => import("./search/search"));
const NotFoundPage = React.lazy(() => import("./not-found"));
const MaterialRenderer = React.lazy(() => import("./material"));

export default function ApplicationRouter () {
    return <Routes>
        <Route path="/" element={ <TitlePage /> } />
        <Route path="/view/:id" element={ <MaterialRenderer /> } />
        <Route path="/:id" element={ <MaterialRenderer strict={ true } /> } />
        <Route path="/search/*" element={ <SearchRenderer /> } />
        <Route path="/forms/*" element={ <GenericForms /> } />
        <Route path="*" element={ <NotFoundPage /> } />
    </Routes>;
}
