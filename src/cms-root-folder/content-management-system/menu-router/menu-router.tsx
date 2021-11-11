import React from "react";
import { classNames, createBootstrapIcon } from "../../../shared/shared-content";

import PageWrapper from "../../../shared/page-wrapper";

import "./menu-router.scss";
import CacheController, { CacheKeys } from "../../../shared/cache-controller";

/**
 * Route of the MenuRouter component
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 */
export const MenuRoute = (props: { icon: string, title: string, children: any }) => <div
    className="no-display">{ props }</div>;

/**
 * Local router with switch buttons
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 */
export default function MenuRouter (props: { children: JSX.Element | JSX.Element[], initialIndex?: number })
{
    const cacheController = new CacheController(window.localStorage);
    const [ selection, setSelection ] = React.useState(Number.isInteger(props.initialIndex)
        ? props.initialIndex as number : -1);

    const containerReference = React.createRef<HTMLDivElement>(),
        children = Array.isArray(props.children) ? props.children : [ props.children ];

    // Get each route content
    const contentItems = children.map(child => <PageWrapper key={ Math.random() }>
        { child.props.children }
    </PageWrapper>);

    // Get each route selector item data
    const selectorMenuItems = children.map((child, index) =>
        <div className={ classNames("menu-item", { select: selection == index }) } key={ Math.random() }
             onClick={ () =>
             {
                 if (selection != index)
                 {
                     cacheController.cacheContent(CacheKeys.cmsMenuRouterPage, index);
                     setSelection(index);
                 }
             } }>

            { createBootstrapIcon(child.props.icon) }
            <span className="item-title">{ child.props.title }</span>
        </div>
    );

    return <div className="side-menu-router" ref={ containerReference }>
        <div className="side-menu-selector"> { selectorMenuItems } </div>
        <div className="router-content">
            { !contentItems[selection] && <span className="no-selection">Откройте одну из страниц, чтобы начать</span> }
            { contentItems[selection] && contentItems[selection] }
        </div>
    </div>;
}
