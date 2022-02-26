import React from "react";

import { Route, Routes } from "react-router-dom";
import MaterialRenderer from "./material";
import NotFoundPage from "./not-found";
import SearchRenderer from "./search";
import TitlePage from "./title-page";

export default function ApplicationRouter () {
    return <Routes>
        <Route path="/" element={ <TitlePage /> } />
        <Route path="/view/:id" element={ <MaterialRenderer /> } />
        <Route path="/:id" element={ <MaterialRenderer strict={ true } /> } />
        <Route path="/search/*" element={ <SearchRenderer /> } />
        <Route path="*" element={ <NotFoundPage /> } />
    </Routes>;
}
