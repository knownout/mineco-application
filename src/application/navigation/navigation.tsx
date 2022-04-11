/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React from "react";
import "./navigation.scss";

import classNames from "../../lib/class-names";
import Input from "../../common/input";

import { Link } from "react-router-dom";

export interface NavigationProps
{
    // Navigation menu items list
    navigationMenu: { [key: string]: { [key: string]: string } };

    // Is application in mobile state
    mobile?: boolean;

    children?: any;

    // Reference
    element? (ref: HTMLElement | null): void;
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
    const MenuSubItem = React.memo((props: { children: string, link: string; query?: string; mobile: boolean }) =>
        <Link to={ props.link } className="menu-sub-item padding">{ props.children }</Link>);

    /**
     * Function for cleaning strings from extra whitespaces and casing
     * @param str string that should be cleaned
     */
    const clean = (str: any) => String(str).replace(/\s/g, "").toLocaleLowerCase();

    /**
     * Menu item renderer (wrapper for the sub items with title)
     * @constructor
     */
    const MenuItem = React.memo((props: {
        children: string, subItems: { [key: string]: string }, right: boolean; query?: string; mobile: boolean
    }) => {
        const [ hover, setHover ] = React.useState(false);
        const [ lock, setLock ] = React.useState(false);

        const entries = props.mobile
            ? Object.entries(props.subItems).filter(([ k ]) => clean(k).includes(clean(props.query)))
            : Object.entries(props.subItems);

        if (entries.length == 0) return null;

        const onEnter = () => setHover(true);
        const onLeave = () => {
            setLock(true);

            setTimeout(() => {
                setHover(false);
                setLock(false);
            }, 100);
        };

        return <div
            className={ classNames("menu-item ui relative", { lock }) } onMouseEnter={ onEnter }
            onMouseLeave={ onLeave }
            onTouchStart={ onEnter }>
            <span className="item-title ui relative">{ props.children }</span>
            <div className={ classNames("sub-items-list ui flex column", { right: props.right }) }>
                <div className="scroll-wrapper">
                    <div className="inner-scroll-wrapper">
                        { (hover || props.mobile) && entries.map(([ title, link ], index) =>
                            <MenuSubItem key={ index } link={ "/" + link } query={ query }
                                         mobile={ props.mobile }>{ title }</MenuSubItem>) }
                    </div>
                </div>
            </div>
        </div>;
    });

    return <nav className={ classNames("navigation-menu", { mobile: props.mobile }) }
                ref={ ref => props.element && props.element(ref) }>
        { props.children }
        { props.mobile && <Input placeholder="Поиск по меню" className="ui margin-bottom" onInput={ setQuery }
                                 icon="bi bi-search" /> }
        { clean(query).length > 0 && <span
            className="search-badge ui opacity-50 fz-14 margin-bottom text-center w-100 padding">
            Результат поиска по запросу <b>«{ query }»</b>
        </span> }
        { Object.entries(props.navigationMenu).map(([ title, subItems ], index) =>
            <MenuItem key={ index } right={ index >= Object.keys(props.navigationMenu).length / 2 }
                      subItems={ subItems } query={ query } mobile={ Boolean(props.mobile) }>{ title }</MenuItem>) }
    </nav>;
}
