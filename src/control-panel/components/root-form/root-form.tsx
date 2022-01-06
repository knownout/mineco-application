import React, { useEffect } from "react";

import Loading from "../../../common/loading";

import verifyAuthentication from "../../cms-lib/verify-authentication";
import { appRoutesList } from "../../../lib/routes-list";

import "./root-form.scss";
import { Tab } from "@headlessui/react";
import classNames from "../../../lib/class-names";
import ItemsList from "../items-list";
import { InitialForm } from "./initial-form";

/**
 * Control panel root component (accessible after authentication)
 * @constructor
 */
export default function RootForm () {
    const [ formLoading, setFormLoading ] = React.useState(true);
    const [ fromLoadingError, setFormLoadingError ] = React.useState<string>();

    const [ mobileMenuHidden, setMobileMenuHidden ] = React.useState(true);

    const [ tabIndex, setTabIndex ] = React.useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!("grecaptcha" in window)) return;
            clearInterval(interval);

            verifyAuthentication().then(result => {
                if (!result) window.location.href = appRoutesList.auth;
                else setFormLoading(false);
            }).catch(setFormLoadingError);
        }, 300);
    }, [ "verification" ]);

    const mobileMenuButtonClassName = classNames("ui interactive clean show-mobile-menu", {
        "mobile-hidden": mobileMenuHidden
    }), navigationPanelClassName = classNames("editor-navigation-panel ui flex column padding-20", {
        "mobile-hidden": mobileMenuHidden
    });

    return <div className="root-form ui container bg-gradient">
        <Loading display={ formLoading } error={ fromLoadingError } />
        <div className="content-wrapper ui flex row">
            <div className={ navigationPanelClassName }>
                <Tab.Group onChange={ setTabIndex }>
                    <Tab.List>
                        <Tab>Материалы</Tab>
                        <Tab>Файлы</Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel children={ <ItemsList.MaterialsList /> } />
                        <Tab.Panel children={ <ItemsList.FilesList /> } />
                    </Tab.Panels>
                </Tab.Group>
            </div>
            <div className="editor-edit-view ui grid center">
                <InitialForm tabIndex={ tabIndex } />
            </div>
            <button className={ mobileMenuButtonClassName } onClick={ () => setMobileMenuHidden(!mobileMenuHidden) }>
                <i className="bi bi-three-dots" />
            </button>
        </div>
    </div>;
}