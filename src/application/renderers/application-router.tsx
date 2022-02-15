import React from "react";
import PageFactory from "./page-factory";

import { Route, Routes } from "react-router-dom";
import TitlePage from "./title-page";
import NotFoundPage from "./not-found";

export default function ApplicationRouter () {
    return <PageFactory>
        <Routes>
            <Route path="/" element={ <TitlePage /> } />
            <Route path="/:id" element={ <div>Material</div> } />
            <Route path="*" element={ <NotFoundPage /> } />
        </Routes>
    </PageFactory>;
}