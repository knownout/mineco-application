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
        menuItemIndex: number;
    }
}

export default class ContentManagementSystem extends React.Component<{}, CMS.State>
{
    state: CMS.State = { fadeOut: false, menuItemIndex: -1 };

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
        const actionBlocksList = [
            <span>Блок аккаунта</span>,
            <span>Блок материалов</span>,
            <span>Блок настроек</span>,
            <span>Блок файлового менеджера</span>
        ].map(e => <PageWrapper key={Math.random()}>{ e }</PageWrapper>);

        return <PageWrapper loadingLabel="Загрузка данных авторизации" fadeOut={ this.state.fadeOut }
                            asyncContent={ this.verifyStoredAccountData } className="cms-root-wrapper">

            <SideMenu itemIndex={ this.state.menuItemIndex }
                      itemIndexChange={ index => this.setState({ menuItemIndex: index }) } />

            <div className="control-wrapper">
                {
                    this.state.menuItemIndex in actionBlocksList
                        ? actionBlocksList[this.state.menuItemIndex]
                        : <span className="no-selection">Выберите один из пунктов меню, чтобы начать</span>
                }
            </div>
        </PageWrapper>;
    }
}
