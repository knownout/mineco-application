import React from "react";

import { Route, Routes } from "react-router-dom";
import TitlePage from "./title-page";
import NotFoundPage from "./not-found";
import MaterialRenderer from "./material";

export default function ApplicationRouter () {
    return <Routes>
        <Route path="/" element={ <TitlePage /> } />
        <Route path="/about-ministry" element={ <div>KD</div> } />
        <Route path="/view/:id" element={ <MaterialRenderer /> } />
        <Route path="*" element={ <NotFoundPage /> } />
    </Routes>;
}
