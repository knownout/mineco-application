import React from "react";

import { classNames, createBootstrapIcon } from "../../../shared/shared-content";

import "./cms-side-menu.scss";

/**
 * Content management system side menu component
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 */
function SideMenu (props: { itemIndexChange? (index: number): void, itemIndex: number })
{
    // Side menu item local component
    function SideMenuItem (props: { icon: string, title: boolean, onClick: any, selected: boolean })
    {
        const className = classNames("side-menu-item", { selected: props.selected });

        return <button className={ className } onClick={ props.onClick }>
            { createBootstrapIcon(props.icon) }
            <span className="item-title">{ props.title }</span>
        </button>;
    }

    // Item click handler
    const onItemClick = (key: number) =>
    {
        // Fire callback
        if (props.itemIndexChange) props.itemIndexChange(key);
    };

    // List of side menu items (icon: itemName)
    const sideMenuItems = {
        "person-badge-fill": "Аккаунт",
        "newspaper": "Материалы",
        "gear-fill": "Настройки",
        "folder-fill": "Файлы"
    };

    return <div className="side-menu-wrapper">
        { Object.keys(sideMenuItems).map((key, index) =>
            <SideMenuItem icon={ key } title={ (sideMenuItems as any)[key] } key={ index } onClick={
                () => onItemClick(index)
            } selected={ props.itemIndex == index } />
        ) }
    </div>;
}

export default React.memo(SideMenu);
