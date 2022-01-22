import React from "react";

import { Tab } from "@headlessui/react";

import classNames from "../../../lib/class-names";
import CacheController, { cacheKeysList } from "../../../lib/cache-controller";
import { appRoutesList, makeRoute, serverRoutesList } from "../../../lib/routes-list";
import useRecaptcha from "../../../lib/use-recaptcha";
import MakeFormData from "../../../lib/make-form-data";

import { LoadingWrapper } from "../../../common/loading/loading";
import Loading from "../../../common/loading";
import Notify from "../../../common/notify";

import { ItemObject } from "./item-object-renderers/renderers";
import ItemsList from "./items-list";

import { Account } from "../../cms-types/account";
import { RequestOptions, Response } from "../../../lib/types/requests";
import verifyAuthentication from "../../cms-lib/verify-authentication";

import InitialView from "./view-renderers/initital-view";
import { FileViewRenderer, VariableViewRenderer } from "./view-renderers/item-objects-view";

import "./root-form.scss";
import MaterialViewRenderer from "./view-renderers/material-view-renderer";
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

    selectedItem: number;
    itemsList: ItemObject.Unknown[];
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
        contentVersion: 0,

        selectedItem: -1,
        itemsList: []
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

        const itemsListProperties = {
            contentVersion: this.state.contentVersion,
            selectedItem: this.state.selectedItem,
            waitContent: this.state.waitContent,
            setWaitContent
        };

        // Controls block
        const controls = <div className="ui content-wrapper flex row">
            <Notify.Component element={ this.notify.ref } />
            <div className={ navMenuClassName }>
                <LoadingWrapper display={ this.state.waitContent } />
                <Tab.Group onChange={ index => this.setState({ itemType: index, selectedItem: -1 }) }>
                    <Tab.List className="tab-component tabs-list">
                        <Tab>Материалы</Tab>
                        <Tab>Файлы</Tab>
                        <Tab>Другое</Tab>
                    </Tab.List>
                    <Tab.Panels className="tab-component tab-panels">
                        {
                            [ 0, 1, 2 ].map((type, index) => {
                                return <Tab.Panel key={ index }>
                                    <ItemsList type={ type } { ...itemsListProperties }
                                               onItemClick={ index => this.setState({
                                                   selectedItem: this.state.selectedItem === index ? -1 : index
                                               }) }
                                               updateItemsList={ itemsList => this.setState({ itemsList }) }
                                               resetSelectedItem={ () => this.setState({
                                                   selectedItem: -1
                                               }) }
                                    />
                                </Tab.Panel>;
                            })
                        }
                    </Tab.Panels>
                </Tab.Group>
            </div>
            <div className="item-view ui grid center">
                <div className={ viewClassName }>
                    { this.genericViewRenderer() }
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

    public genericViewRenderer () {
        const onContentUpdate = () => this.setState({
            selectedItem: -1, contentVersion: this.state.contentVersion + 1
        });

        const commonProps = { onLoadStateChange: (loadState: boolean) => this.setState({ waitContent: loadState }) };

        /** Props for the empty (new) material (just stub) */
        const empty = {
            identifier: "create-new", attachments: "",
            title: "", datetime: (Date.now() / 1000).toString(),
            preview: "_default-minecoBuilding.jpg", description: "",
            tags: "", pinned: ""
        } as ItemObject.Material;

        // -2 used to create new materials
        if (this.state.selectedItem === -2)
            return <MaterialViewRenderer { ...commonProps } { ...empty } notify={ this.notify }
                                         onMaterialDelete={ onContentUpdate }
                                         onMaterialUpdate={ onContentUpdate } />;

        // Show initial form if no items selected
        if (this.state.selectedItem < 0)
            return <InitialView type={ this.state.itemType } waitContent={ this.state.waitContent }
                                onGenericButtonClick={ this.genericButtonClickEventHandler } />;

        const itemData = this.state.itemsList[this.state.selectedItem];
        const viewRenderers = [
            <MaterialViewRenderer { ...itemData as ItemObject.Material } { ...commonProps } notify={ this.notify }
                                  onMaterialDelete={ onContentUpdate }
                                  onMaterialUpdate={ onContentUpdate } />,
            <FileViewRenderer { ...itemData as ItemObject.File } { ...commonProps }
                              onFileDelete={ onContentUpdate } />,
            <VariableViewRenderer { ...itemData as ItemObject.Variable } notify={ this.notify } { ...commonProps }
                                  onContentUpdate={ onContentUpdate } />
        ];

        return viewRenderers[this.state.itemType];
    }

    /**
     * Event handler for the initial view generic button
     * @param event React MouseEvent
     */
    public genericButtonClickEventHandler (event: React.MouseEvent<HTMLButtonElement>) {
        switch (this.state.itemType) {
            case Type.materials:
                this.setState({ selectedItem: -2 })
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
                if (response && response.success)
                    return this.setState({ contentVersion: this.state.contentVersion + 1 }, resolve);
                else return reject();
            }).finally(() => this.setState({ waitContent: false }, () => dialog.remove()))
                .catch(() => this.notify.add("Ошибка загрузки файла на сервер"));
        };

        dialog.click();
    }
}