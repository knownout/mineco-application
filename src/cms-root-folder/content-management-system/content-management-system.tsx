// Library import
import React from "react";
// Helpers import
import { verifyStoredAccountData } from "../../shared/shared-content";
// Internal components import
import PageWrapper from "../../shared/page-wrapper";
// Stylesheets import
import "./content-management-system.scss";

import MenuRouter, { MenuRoute } from "./menu-router/menu-router";
import AccountBlock from "./content-blocks/account-block";
import CacheController, { CacheKeys } from "../../shared/cache-controller";
import PropertiesBlock from "./content-blocks/properties-block";

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
    private cacheController = new CacheController(window.localStorage);

    private verifyStoredAccountData ()
    {
        return verifyStoredAccountData(result =>
        {
            if (result) return;

            window.location.href = "/content-management-system/auth";
            this.setState({ fadeOut: true });
        });
    }

    render (): React.ReactNode
    {
        const cmsMenuRouterPage = this.cacheController.fromCache<number>(CacheKeys.cmsMenuRouterPage);

        return <PageWrapper loadingLabel="Загрузка данных авторизации" fadeOut={ this.state.fadeOut }
                            asyncContent={ this.verifyStoredAccountData } className="cms-root-wrapper">
            <MenuRouter initialIndex={ Number.isInteger(cmsMenuRouterPage) ? cmsMenuRouterPage as number : 0 }>
                <MenuRoute icon="person-bounding-box" title="Аккаунт">
                    <AccountBlock />
                </MenuRoute>
                <MenuRoute icon="newspaper" title="Материалы">
                    Материалы
                </MenuRoute>
                <MenuRoute icon="gear-fill" title="Настройки">
                    <PropertiesBlock />
                </MenuRoute>
                <MenuRoute icon="folder-fill" title="Файлы">
                    Файлы
                </MenuRoute>
            </MenuRouter>
        </PageWrapper>;
    }
}
