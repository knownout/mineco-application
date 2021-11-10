import React from "react";
import { createBootstrapIcon } from "../../../shared/shared-content";

import "./cms-side-menu.scss";

/**
 * Content management system side menu component
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 0.0.1
 */
export default function SideMenu (props: { onItemChange? (index: number): void })
{
    // Side menu item local component
    function SideMenuItem (props: { icon: string, title: boolean, onClick?: any })
    {
        return <button className="side-menu-item" onClick={ props.onClick }>
            { createBootstrapIcon(props.icon) }
            <span className="item-title">{ props.title }</span>
        </button>;
    }

    // Item click handler
    const onItemClick = (event: React.MouseEvent<HTMLButtonElement>, key: number) =>
    {
        /*
         * React state not used because css transitions can not work
         * with state update without some crutches
         */

        const target = event.target as HTMLButtonElement;
        if (!target) return;

        // Get all selected items and remove (de-select) selection class
        (target.parentElement as HTMLDivElement).querySelectorAll(".selected")
            .forEach(item => item.classList.remove("selected"));

        // Add selection class to target element
        target.classList.add("selected");

        // Fire callback
        if (props.onItemChange) props.onItemChange(key);
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
                (event: React.MouseEvent<HTMLButtonElement>) => onItemClick(event, index)
            } />)
        }
    </div>;
}
