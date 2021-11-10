// Library import
import React from "react";

// Helpers import
import { verifyStoredAccountData } from "../../shared/shared-content";

// Internal components import
import PageWrapper from "../../shared/page-wrapper";

// Stylesheets import
import "./content-management-system.scss";

namespace CMS
{
    export interface State
    {
        fadeOut: boolean;
    }
}
export default class ContentManagementSystem extends React.Component<{}, CMS.State>
{
    state: CMS.State = { fadeOut: false };

    render (): React.ReactNode
    {
        return <PageWrapper loadingLabel="Загрузка данных авторизации" fadeOut={ this.state.fadeOut } asyncContent={
            () => verifyStoredAccountData(result =>
            {
                if (result) return;

                this.setState({ fadeOut: true });
                setTimeout(() =>
                    window.location.href = "/content-management-system/auth", 100);
            })
        }>
            CMS
        </PageWrapper>;
    }
}
