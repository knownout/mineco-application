import React from "react";

import Loading from "../../../common/loading";

import verifyAuthentication from "../../cms-lib/verify-authentication";
import { appRoutesList } from "../../../lib/routes-list";

import "./root-form.scss";
import { Tab } from "@headlessui/react";
import classNames from "../../../lib/class-names";
import ItemsList from "../items-list";
import { InitialForm } from "./initial-form";
import RequestItems, { RequestItemType } from "./request-items";
import Material from "../rendrers/material";
import File from "../rendrers/file";
import uploadFile from "./handlers/upload-file";
import Notify from "../../../common/notify";

interface RootFormState {
    formLoading: boolean;
    formLoadingError?: string;

    mobileMenuState: boolean;
    waitForResponse: boolean;

    itemsType: RequestItemType;

    itemsList?: JSX.Element | JSX.Element[];
}

interface MaterialObject {
    identifier: string;
    title: string;
    tags: string;
    description: string;
    preview: string;
    datetime: string;
}

interface FileObject {
    identifier: string;
    filename: string;
}

/**
 * Control panel root component (accessible after authentication)
 * @constructor
 */
export default class RootForm extends React.PureComponent<{}, RootFormState> {
    public readonly state: RootFormState = {
        formLoading: true,
        mobileMenuState: false,
        waitForResponse: false,

        itemsType: RequestItemType.materials
    };

    private readonly notifyRef = React.createRef<HTMLDivElement>();
    private readonly notify = new Notify(this.notifyRef);

    constructor (props: {}) {
        super(props);

        this.updateItemsList = this.updateItemsList.bind(this);
        this.initialButtonClickHandler = this.initialButtonClickHandler.bind(this);
    }

    componentDidMount () {
        const interval = setInterval(() => {
            if (!("grecaptcha" in window)) return;
            clearInterval(interval);

            verifyAuthentication().then(result => {
                if (!result) window.location.href = appRoutesList.auth;
                else this.setState({ formLoading: false }, () => { this.updateItemsList(); });
            }).catch(error => this.setState({ formLoadingError: error }));
        }, 300);
    }

    render () {
        const mobileMenuButtonClassName = classNames("ui interactive clean show-mobile-menu", {
            "mobile-hidden": !this.state.mobileMenuState
        }), navigationPanelClassName = classNames("editor-navigation-panel ui flex column padding-20", {
            "mobile-hidden": !this.state.mobileMenuState,
            waiting: this.state.waitForResponse
        });

        return <div className="root-form ui container bg-gradient">
            <Loading display={ this.state.formLoading } error={ this.state.formLoadingError } />
            <Notify.Component element={ this.notify.ref } />
            <div className="content-wrapper ui flex row">
                <div className={ navigationPanelClassName }>
                    <div className={ classNames("loading-wrapper ui grid center", {
                        display: this.state.waitForResponse
                    }) }>
                        <i className="ui loading-spinner" />
                    </div>

                    <Tab.Group onChange={ index => this.setState({ itemsType: index }, this.updateItemsList) }>
                        <Tab.List>
                            <Tab>Материалы</Tab>
                            <Tab>Файлы</Tab>
                        </Tab.List>
                        <Tab.Panels>
                            <Tab.Panel>
                                <ItemsList.MaterialsList onReturn={ this.updateItemsList }>
                                    { this.state.itemsList || <span
                                        className="ui opacity-75">Материалы не найдены</span> }
                                </ItemsList.MaterialsList>
                            </Tab.Panel>
                            <Tab.Panel>
                                <ItemsList.MaterialsList onReturn={ this.updateItemsList }>
                                    { this.state.itemsList || <span className="ui opacity-75">Файлы не найдены</span> }
                                </ItemsList.MaterialsList>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
                <div className={ classNames("editor-edit-view ui grid center", {
                    disabled: this.state.waitForResponse || this.state.formLoading || this.state.formLoadingError
                }) }>
                    <InitialForm itemsType={ this.state.itemsType } onClick={ this.initialButtonClickHandler } />
                </div>
                <button className={ mobileMenuButtonClassName }
                        onClick={ () => this.setState({ mobileMenuState: !this.state.mobileMenuState }) }>
                    <i className="bi bi-three-dots" />
                </button>
            </div>
        </div>;
    }

    private async initialButtonClickHandler () {
        if (this.state.itemsType == RequestItemType.files) {
            await uploadFile(waitState => this.setState({ waitForResponse: waitState })).catch(error => {
                if (error) this.notify.add(error);
            });
            await this.updateItemsList();
        }
    }

    private async updateItemsList (searchQuery: string = "") {
        this.setState({ waitForResponse: true });

        const request = new RequestItems(this.state.itemsType);
        type UnitedObjectType = (MaterialObject | FileObject)[];

        const rawItemsList = await request.requestItems<UnitedObjectType>(searchQuery)
            .catch(error => this.setState({ formLoading: true, formLoadingError: error }));

        if (rawItemsList && rawItemsList.success) {
            const itemsList = (rawItemsList.responseContent as UnitedObjectType)
                .map((rawItem, index) => {
                    if (this.state.itemsType === RequestItemType.materials) {
                        const typedItem = rawItem as MaterialObject;
                        return <Material { ...typedItem } key={ index }>{ typedItem.description }</Material>;
                    } else return <File filename={ (rawItem as FileObject).filename } key={ index } />;
                });

            this.setState({ itemsList });
        } else this.setState({ itemsList: undefined });

        this.setState({ waitForResponse: false });
    }
}