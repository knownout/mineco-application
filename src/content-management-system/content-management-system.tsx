import React, { PureComponent } from "react";
import PageWrapper from "../shared/page-wrapper";
import { Requests } from "../shared/shared-types";

export namespace CMS {
    export interface Properties
    {

    }

    export interface State
    {
        request?: Requests.ActionsList
    }
}

export default class ContentManagementSystem extends PureComponent<CMS.Properties, CMS.State> {

    render (): React.ReactNode
    {
        return <PageWrapper>
            Content management system entry point
        </PageWrapper>
    }
}