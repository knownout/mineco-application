// Library import
import React from "react";
// Helpers import
import { defaultPathsList, verifyStoredAccountData } from "../../shared/shared-content";
import CacheController, { CacheKeys } from "../../shared/cache-controller";
import { Requests } from "../../shared/shared-types";
// Internal components import
import PageWrapper from "../../shared/page-wrapper";
import MenuRouter, { MenuRoute } from "./menu-router/menu-router";

const Materials = React.lazy(() => import("../internal-components/materials/materials"));
//Action blocks import
const AccountBlock = React.lazy(() => import("./content-blocks/account-block"));
const PropertiesBlock = React.lazy(() => import("./content-blocks/properties-block"));
const FilesBlock = React.lazy(() => import("./content-blocks/files-block"));
// Stylesheets import
import "./content-management.scss";

namespace CMS
{
    export interface State
    {
        fadeOut: boolean;
        menuItemIndex: number;
    }
}

/**
 * Root component of the content management system
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 */
export default class ContentManagement extends React.Component<{}, CMS.State>
{
    state: CMS.State = { fadeOut: false, menuItemIndex: -1 };
    private cacheController = new CacheController(window.localStorage);

    private verifyStoredAccountData ()
    {
        return verifyStoredAccountData(result =>
        {
            if (result) return;

            window.location.href = defaultPathsList.contentManagementSystemAuth;
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
                    <Materials endpoint={ defaultPathsList.request } filters={ {
                        [Requests.TypesList.Action]: Requests.ActionsList.getMaterials
                    } } />
                </MenuRoute>
                <MenuRoute icon="gear-fill" title="Настройки">
                    <PropertiesBlock />
                </MenuRoute>
                <MenuRoute icon="folder-fill" title="Файлы">
                    <FilesBlock />
                </MenuRoute>
            </MenuRouter>
        </PageWrapper>;
    }
}
