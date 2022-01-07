import React from "react";

import { Tab } from "@headlessui/react";

import classNames from "../../../lib/class-names";

import { LoadingWrapper } from "../../../common/loading/loading";
import Loading from "../../../common/loading";

import { ItemObject } from "./item-object-renderers/renderers";
import ItemsList from "./items-list";

import "./root-form.scss";
import verifyAuthentication from "../../cms-lib/verify-authentication";
import CacheController, { cacheKeysList } from "../../../lib/cache-controller";
import { appRoutesList, makeRoute, serverRoutesList } from "../../../lib/routes-list";
import InitialView from "./view-renderers/initital-view";
import useRecaptcha from "../../../lib/use-recaptcha";
import MakeFormData from "../../../lib/make-form-data";
import { Account } from "../../cms-types/account";
import Notify from "../../../common/notify";
import { RequestOptions, Response } from "../../cms-types/requests";
import Type = ItemObject.Type;


interface RootFormState {
    formLoaded: boolean;
    formLoadingError?: unknown;

    waitContent: boolean;
    mobileMenuOpen: boolean;

    itemType: ItemObject.Type;

    // Component will update this when there might be a new
    // content at the server (when file uploaded or something)
    contentVersion: number;
}

/**
 * Root control panel component (controls)
 * @inner
 */
export default class RootForm extends React.PureComponent<{}, RootFormState> {
    public readonly state: RootFormState = {
        formLoaded: false,

        waitContent: true,
        mobileMenuOpen: false,

        itemType: 0,
        contentVersion: 0
    };

    private readonly notify = new Notify(React.createRef<HTMLDivElement>());

    constructor (props: {}) {
        super(props);

        this.genericButtonClickEventHandler = this.genericButtonClickEventHandler.bind(this);
        this.componentFileUploadHandler = this.componentFileUploadHandler.bind(this);
    }

    componentDidMount () {
        const interval = setInterval(() => {
            if ("grecaptcha" in window) {
                clearInterval(interval);

                const cacheController = new CacheController(localStorage);

                verifyAuthentication().catch(() => {
                    cacheController.removeItem(cacheKeysList.accountData);
                    window.location.href = appRoutesList.auth;
                }).then(response => {
                    if (response) return this.setState({ formLoaded: true });

                    cacheController.removeItem(cacheKeysList.accountData);
                    window.location.href = appRoutesList.auth;
                });
            }
        }, 300);

    }

    render () {
        // Callback for the ItemsList component
        const setWaitContent = (waitContent: boolean) => this.setState({ waitContent });

        const navMenuClassName = classNames("navigation-menu ui flex column scroll", {
            wait: this.state.waitContent,
            "menu-open": this.state.mobileMenuOpen
        });

        const viewClassName = classNames("ui content-wrapper flex row scroll", {
            disabled: this.state.waitContent || !this.state.formLoaded
        });

        // Controls block
        const controls = <div className="ui content-wrapper flex row">
            <Notify.Component element={ this.notify.ref } />
            <div className={ navMenuClassName }>
                <LoadingWrapper display={ this.state.waitContent } />
                <Tab.Group onChange={ index => this.setState({ itemType: index }) }>
                    <Tab.List className="tab-component tabs-list">
                        <Tab>Материалы</Tab>
                        <Tab>Файлы</Tab>
                        <Tab>Другое</Tab>
                    </Tab.List>
                    <Tab.Panels className="tab-component tab-panels">
                        {
                            [ 0, 1, 2 ].map((type, index) => {
                                return <Tab.Panel key={ index }>
                                    <ItemsList type={ type } setWaitContent={ setWaitContent }
                                               waitContent={ this.state.waitContent }
                                               contentVersion={ this.state.contentVersion } />
                                </Tab.Panel>;
                            })
                        }
                    </Tab.Panels>
                </Tab.Group>
            </div>
            <div className="item-view ui grid center">
                <div className={ viewClassName }>
                    <InitialView type={ this.state.itemType } waitContent={ this.state.waitContent }
                                 onGenericButtonClick={ this.genericButtonClickEventHandler } />
                </div>
            </div>
        </div>;

        // Class name for the mobile menu open button
        const mobileMenuBtnClassName = classNames("mobile-menu-button ui clean interactive border-round", {
            "menu-open": this.state.mobileMenuOpen
        });

        return <div className="root-form ui container flex row">
            <Loading display={ !this.state.formLoaded } error={ this.state.formLoadingError } />
            { this.state.formLoaded && controls }

            <button className={ mobileMenuBtnClassName }
                    onClick={ () => this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen }) }>
                <i className="bi bi-three-dots" />
            </button>
        </div>;
    }

    /**
     * Event handler for the initial view generic button
     * @param event React MouseEvent
     */
    public genericButtonClickEventHandler (event: React.MouseEvent<HTMLButtonElement>) {
        switch (this.state.itemType) {
            case Type.materials:
                break;

            case Type.files:
                this.componentFileUploadHandler();
                break;

            default:
                break;
        }
    }

    /**
     * Method for uploading files to the server
     */
    public componentFileUploadHandler () {
        const cacheController = new CacheController(localStorage);

        // Create input file html element
        const dialog = document.createElement("input");
        dialog.type = "file";

        dialog.onchange = async () => {
            // Abort file uploading if no files provided
            if (!dialog.files || dialog.files.length != 1) return dialog.remove();

            this.setState({ waitContent: true });
            new Promise<void>(async (resolve, reject) => {
                const token = await useRecaptcha().catch(reject);

                // Check if account data exist and get it
                const accountData = cacheController.getItem<Account.Response>(cacheKeysList.accountData);
                if (!accountData || !token || !dialog.files)
                    return reject("Ошибка создания запроса, файл не загружен");

                const formData = new MakeFormData({
                    [RequestOptions.recaptchaToken]: token,
                    [RequestOptions.accountLogin]: accountData.login,
                    [RequestOptions.accountHash]: accountData.hash,
                    [RequestOptions.uploadFile]: dialog.files[0]
                });

                // Send file upload request
                const response = await fetch(makeRoute(serverRoutesList.uploadFile), formData.fetchObject)
                    .then(response => response.json())
                    .catch(reject) as Response<unknown>;

                // Check response
                if (response.success)
                    return this.setState({ contentVersion: this.state.contentVersion + 1 }, resolve);
                else return reject();
            }).finally(() => this.setState({ waitContent: false }, () => dialog.remove()))
                .catch(() => this.notify.add("Ошибка загрузки файла на сервер"));
        };

        dialog.click();
    }
}