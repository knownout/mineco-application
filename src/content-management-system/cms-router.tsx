// Library import
import React from "react";
import { Route, Routes } from "react-router-dom";
// External components import
import { Helmet } from "react-helmet";
// Internal components import
import DefaultLoadingHandler from "../shared/page-wrapper/default-handlers/default-loading-handler";

const NotFoundHandler = React.lazy(() => import("../shared/page-wrapper/default-handlers/not-found-handler"));
const AuthenticationForm = React.lazy(() => import("./authentication-form/authentication-form"));
const ContentManagement = React.lazy(() => import("./content-management/content-management"));
const Editor = React.lazy(() => import("./internal-components/editor/editor"));

export interface TEditorRouteParameters
{
    identifier: string
}

/**
 * Content management system router
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
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

            <React.Suspense fallback={ <DefaultLoadingHandler /> }>
                <Routes>
                    <Route path="/auth" element={ <AuthenticationForm /> } />
                    <Route path="/" element={ <ContentManagement /> } />
                    <Route path="*" element={ <NotFoundHandler /> } />
                    <Route path="/edit/:identifier" element={ <Editor /> } />
                </Routes>
            </React.Suspense>
        </React.Fragment>;
    }
}
