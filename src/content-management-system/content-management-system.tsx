import React, { PureComponent } from "react";
import PageWrapper from "../shared/page-wrapper";

export namespace CMS
{
    export interface Properties
    {

    }

    export interface State
    {

    }
}

export default class ContentManagementSystem extends PureComponent<CMS.Properties, CMS.State>
{
    render (): React.ReactNode
    {
        return <PageWrapper>
            Content management system entry point
        </PageWrapper>;
    }
}