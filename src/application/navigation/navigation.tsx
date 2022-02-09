import React from "react";
import "./navigation.scss";

import classNames from "../../lib/class-names";
import Input from "../../common/input";

import { Link } from "react-router-dom";

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
    const [ query, setQuery ] = React.useState<string>(String());

    /**
     * Sub item renderer (item inside list)
     * @constructor
     */
    const MenuSubItem = (props: { children: string, link: string; query?: string; mobile: boolean }) =>
        <Link to={ props.link } className="menu-sub-item padding">{ props.children }</Link>;

    /**
     * Menu item renderer (wrapper for the sub items with title)
     * @constructor
     */
    const MenuItem = (props: {
        children: string, subItems: { [key: string]: string }, right: boolean; query?: string; mobile: boolean
    }) => {
        const clean = (str: any) => String(str).replace(/\s/g, "").toLocaleLowerCase();
        const entries = props.mobile
            ? Object.entries(props.subItems).filter(([ k ]) => clean(k).includes(clean(props.query)))
            : Object.entries(props.subItems);

        if (entries.length == 0) return null;
        return <div
            className="menu-item ui relative">
            <span className="item-title ui relative">{ props.children }</span>
            <div className={ classNames("sub-items-list ui flex column", { right: props.right }) }>
                <div className="scroll-wrapper">
                    { entries.map(([ title, link ], index) =>
                        <MenuSubItem key={ index } link={ link } query={ query }
                                     mobile={ props.mobile }>{ title }</MenuSubItem>) }
                </div>
            </div>
        </div>;
    };

    return <nav className={ classNames("navigation-menu", { mobile: props.mobile }) }>
        { props.mobile && <Input placeholder="Поиск по меню" className="ui margin-bottom" onInput={ setQuery }
                                 icon="bi bi-search" /> }
        { Object.entries(props.navigationMenu).map(([ title, subItems ], index) =>
            <MenuItem key={ index } right={ index >= Object.keys(props.navigationMenu).length / 2 }
                      subItems={ subItems } query={ query } mobile={ Boolean(props.mobile) }>{ title }</MenuItem>) }
    </nav>;
}