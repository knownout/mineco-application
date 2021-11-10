// Library import
import React from "react";

// Helpers import
import { verifyStoredAccountData } from "../../shared/shared-content";

// Internal components import
import PageWrapper from "../../shared/page-wrapper";
import SideMenu from "./cms-side-menu/cms-side-menu";

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

    private verifyStoredAccountData ()
    {
        return verifyStoredAccountData(result =>
        {
            if (result) return;

            this.setState({ fadeOut: true });
            setTimeout(() =>
                window.location.href = "/content-management-system/auth", 100);
        });
    }

    render (): React.ReactNode
    {
        return <PageWrapper loadingLabel="Загрузка данных авторизации" fadeOut={ this.state.fadeOut }
                            asyncContent={ this.verifyStoredAccountData } className="cms-root-wrapper">
            <SideMenu onItemChange={ console.log } />
            <div className="control-wrapper">
                <span className="no-selection">Выберите один из пунктов меню, чтобы начать</span>
            </div>
        </PageWrapper>;
    }
}
