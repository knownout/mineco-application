// Library import
import React from "react";
import { Route, Routes } from "react-router-dom";
// External components import
import { Helmet } from "react-helmet";
// Internal components import
import NotFoundHandler from "../shared/page-wrapper/default-handlers/not-found-handler";
import AuthenticationForm from "./authentication-form/authentication-form";
import ContentManagement from "./content-management/content-management";
import Editor from "./internal-components/editor/editor";

export interface TEditorRouteParameters
{
    identifier: string
}

/**
 * Content management system router
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
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
                <Route path="/" element={ <ContentManagement /> } />
                <Route path="*" element={ <NotFoundHandler /> } />
                <Route path="/edit/:identifier" element={ <Editor /> } />
            </Routes>
        </React.Fragment>;
    }
}
