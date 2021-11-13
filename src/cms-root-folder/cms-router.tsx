// Library import
import React from "react";
import { Route, Routes } from "react-router-dom";
// External components import
import { Helmet } from "react-helmet";
// Internal components import
import NotFoundHandler from "../shared/page-wrapper/default-handlers/not-found-handler";
import AuthenticationForm from "./authentication-form/authentication-form";
import ContentManagementSystem from "./content-management-system/content-management-system";

export default class CmsRouter extends React.PureComponent
{

    render (): React.ReactNode
    {
        return <React.Fragment>
            <Helmet>
                <link rel="icon" href="/public/cms-favicon.ico" />
                <title>Панель управления МСХ и ПР</title>
            </Helmet>

            <Routes>
                <Route path="/auth" element={ <AuthenticationForm /> } />
                <Route path="/" element={ <ContentManagementSystem /> } />
                <Route path="*" element={ <NotFoundHandler /> } />
            </Routes>
        </React.Fragment>;
    }
}
