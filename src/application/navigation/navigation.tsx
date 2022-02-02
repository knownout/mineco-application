import React from "react";
import "./navigation.scss";
import classNames from "../../lib/class-names";

export interface NavigationProps {
    // Navigation menu items list
    navigationMenu: { [key: string]: { [key: string]: string } };

    // Is application in mobile state
    mobile?: boolean;
}


/**
 * Navigation menu component
 *
 * @internal
 * @constructor
 */
export default function Navigation (props: NavigationProps) {
    /**
     * Sub item renderer (item inside list)
     * @constructor
     */
    const MenuSubItem = (props: { children: string, link: string }) =>
        <a href={ props.link } className="menu-sub-item padding">{ props.children }</a>;

    /**
     * Menu item renderer (wrapper for the sub items with title)
     * @constructor
     */
    const MenuItem = (props: { children: string, subItems: { [key: string]: string }, right: boolean }) => <div
        className="menu-item ui relative">
        <span className="item-title ui relative">{ props.children }</span>
        <div className={ classNames("sub-items-list ui flex column", { right: props.right }) }>
            <div className="scroll-wrapper">
                { Object.entries(props.subItems).map(([ title, link ], index) =>
                    <MenuSubItem key={ index } link={ link }>{ title }</MenuSubItem>) }
            </div>
        </div>
    </div>;

    return <nav className={ classNames("navigation-menu", { mobile: props.mobile }) }>
        { Object.entries(props.navigationMenu).map(([ title, subItems ], index) =>
            <MenuItem key={ index } right={ index >= Object.keys(props.navigationMenu).length / 2 }
                      subItems={ subItems }>{ title }</MenuItem>) }
    </nav>;
}