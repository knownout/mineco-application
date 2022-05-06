/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../../common/button";
import Condition from "../../common/condition";
import { Account } from "../../control-panel/cms-types/account";
import CacheController, { cacheKeysList } from "../../lib/cache-controller";
import classNames from "../../lib/class-names";
import { appRoutesList } from "../../lib/routes-list";
import { ApplicationContext, VariablesStorage } from "../application";
import Navigation from "../navigation";
import "./header.scss";

/**
 * Component for rendering social icons (like telegram, email, etc.)
 * @constructor
 */
export function SocialDataRenderer (props: { socialData: { [key: string]: string }[] }) {
    /**
     * Social icons block renderer
     * @param keyData social icons variable object entry
     * @param index block index in array
     * @internal
     */
    const socialDataBlockEntry = (keyData: [ string, string ], index: number) => {
        // Entries that should be specially processed (like mailto:..., tel:..., etc.)
        const staticEntries = [ "email", "phone" ];

        if (!Array.isArray(keyData[1])) return null;
        const title = staticEntries.includes(keyData[0])
            ? keyData[1][0].split(":").slice(1).join(":")
            : keyData[0][0].toLocaleUpperCase() + keyData[0].slice(1).toLocaleLowerCase();

        return <a href={ keyData[1] } className="ui clean flex row gap" target="_blank" key={ index }>
            <span className="icon-holder ui flex center">
                { Array.isArray(keyData[1]) && <img src={ keyData[1][1] } alt="" /> }
            </span>
            <span className="item-title">{ title }</span>
        </a>;
    };

    /**
     * Convert social data variable to the array of social data blocks
     */
    const socialDataBlocks = props.socialData.map((data, index) => {
        return <div className="social-data-block ui flex row gap-5 wrap" key={ index }>
            { Object.entries(data).map(socialDataBlockEntry) }
        </div>;
    });

    return <div className="social-data ui flex column gap-5" children={ socialDataBlocks } />;
}

/**
 * Component for rendering control panel bar
 * @internal
 * @constructor
 */
function ControlPanelBar () {
    const identifier = useLocation().pathname.split("/").map(e => e.trim())
        .filter(e => e.length > 0);

    const isView = !window.location.pathname.includes("/search") && window.location.pathname != "/";
    const location = appRoutesList.cms + (isView && identifier.length > 0 ? `/${ identifier.pop() }` : "");

    const cacheController = React.useRef(new CacheController(localStorage));
    const [ accountData, setAccountData ] = React.useState<Account.Response | false>(cacheController.current
        .getItem<Account.Response>(cacheKeysList.accountData));

    const accountExitHandler = () => {
        cacheController.current.removeItem(cacheKeysList.accountData);
        setAccountData(false);
    };

    if (!accountData) return null;
    // noinspection HtmlUnknownTarget
    return <div className="control-panel-bar ui flex row w-100 h-fit fz-14 center">
        <div className="content-wrapper ui limit-1280 flex row gap no-wrap">
            <div className="user-name ui padding">{ accountData.fullname }</div>
            <div className="quick-actions ui margin-left-auto flex row">
                <a href={ location } target="_blank" className="ui padding clean">
                    { isView ? "Редактировать материал" : "Открыть панель управления" }
                </a>
                <span className="ui padding" onClick={ accountExitHandler }>Выйти</span>
            </div>
        </div>
    </div>;
}

/**
 * Component for creating application header
 * @constructor
 */
export default function Header () {
    const context = React.useContext(ApplicationContext);

    // Application mobile state
    const [ mobile, setMobile ] = React.useState(false);

    // Mobile menu open state
    const [ open, setOpen ] = React.useState(false);

    // Get variables data from context
    const variablesData = context.variablesData as VariablesStorage;

    // References to navigation menu and dynamic-content div
    const navigationMenu = React.useRef<HTMLElement | null>();

    const path = useLocation().pathname;

    /**
     * Function for handling window resize
     * @param width navigation menu width (bound)
     */

    React.useLayoutEffect(() => {
        const current = navigationMenu.current;
        if (!current) return;

        // Bind navigation menu width to resize handler
        if (window.innerWidth < current.offsetWidth)
            setMobile(true);
    }, [ navigationMenu.current ]);

    React.useLayoutEffect(() => {
        setTimeout(() => setOpen(false), 150);
    }, [ path ]);

    /**
     * Component for rendering header extra buttons
     * @constructor
     * @internal
     */
    function ExtraButtons () {
        // Check if list of navigation items is defined
        const navigationPanel = context.variablesData?.navigationPanel;
        if (!navigationPanel) return null;

        // Define the name of additional buttons (should be identical with navigation item names)
        const itemNames = [ "Виртуальная приемная", "Горячие линии" ];

        return <div className="extra-buttons ui flex column margin-left-auto flex flex-end-ai gap">
            { itemNames.map((item, key) =>
                <Link to={ "/" + navigationPanel["Контакты"][item] } className="ui clean" key={ key }>
                    <Button className="w-fit" spanClassName="no-text-wrap-ellipsis">{ item }</Button>
                </Link>
            ) }
        </div>;
    }

    return <>
        <header className={ classNames("header-component ui flex column center w-100", { mobile }) }>
            { variablesData && <>
                {/* Static content */ }

                <div className="static-top-container ui flex row center gap-20">
                    <div className="data-container ui flex column gap-20">
                        <Link className="website-title ui flex row center gap clean" to="/">
                            <div className="mineco-logo-holder">
                                <img src="/public/mineco-logo-transparent.png" alt="Логотип Министерства" />
                            </div>
                            <h1 className="mineco-title-text">{ variablesData.websiteTitle }</h1>
                        </Link>
                        { !mobile && <SocialDataRenderer socialData={ variablesData.socialData } /> }
                    </div>

                    { !mobile && <ExtraButtons /> }
                </div>

                {/* Dynamic content (navigation menu) */ }
                <ControlPanelBar />
            </> }
        </header>

        <Condition condition={ mobile }>
            <Button className={ classNames("mobile-menu", { open }) } children="Меню"
                    icon="bi bi-three-dots" onClick={ () => setOpen(!open) } />
        </Condition>

        <div className={ classNames("dynamic-container nav-menu-container ui flex center-ai w-100",
            { mobile, open }) }>

            {/* If navigation menu always rendered, application become ve-e-ery slow on phones */ }

            { (!mobile || (mobile && open)) &&
                <Navigation navigationMenu={ variablesData.navigationPanel } mobile={ mobile }
                            element={ ref => navigationMenu.current = ref }>
                    { mobile && <div className="social-data-holder ui margin-bottom">
                        <SocialDataRenderer socialData={ variablesData.socialData } />
                    </div> }
                </Navigation> }
        </div>
    </>;
}
