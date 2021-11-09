// Library import
import React from "react";
import { Routes, Route } from "react-router-dom";

import { AccountContext, AccountProvider } from "../account-provider";

// Internal components import
import NotFoundHandler from "../shared/page-wrapper/default-handlers/not-found-handler";
import AuthenticationForm from "./authentication-form/authentication-form";

// Stylesheets import
import "./content-management-system.scss";

namespace CMS
{
    export interface Properties
    {

    }

    export interface State
    {
        fadeOut: boolean
    }
}

export default class ContentManagementSystem extends React.PureComponent<CMS.Properties, CMS.State>
{
    state: CMS.State = { fadeOut: false };

    declare context: React.ContextType<typeof AccountContext>;
    static contextType = AccountContext;

    render (): React.ReactNode
    {
        return <AccountProvider>
            <Routes>
                <Route path="/auth" element={ <AuthenticationForm /> } />
                <Route path="/" element={ <span>CMS</span> } />
                <Route path="*" element={ <NotFoundHandler /> } />
            </Routes>
        </AccountProvider>;
    }
}
