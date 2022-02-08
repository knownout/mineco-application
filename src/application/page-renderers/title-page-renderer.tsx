import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkInlineLinks from "remark-inline-links";

import { appRoutesList, makeRoute, serverRoutesList } from "../../lib/routes-list";
import { MaterialSearchOptions, RequestOptions, Response, VariableOptions } from "../../lib/types/requests";
import MakeFormData from "../../lib/make-form-data";

import { ItemObject } from "../../control-panel/components/root-form/item-object-renderers/renderers";

import Loading from "../../common/loading";
import Header from "../header";

import "./page-renderers.scss";
import { HeaderComponentProps, HeaderLogoComponent } from "../header/header";
import Condition from "../../common/condition";
import convertDate from "../../lib/convert-date";
import PredefinedIcons from "./predefined-icons";
import classNames from "../../lib/class-names";
import Button from "../../common/button";

interface TitlePageRendererProps extends HeaderComponentProps {
}

/**
 * Title page renderer state
 */
interface TitlePageRendererState {
    // Is page loading
    loading: boolean;

    // Page loading error
    error?: any;

    // List of the latest materials to be displayed
    materialsList?: ItemObject.Material[];

    // Pinned material
    pinnedMaterial?: ItemObject.Material;

    // Important data from the database
    importantData?: string;

    // Relative links list (footer)
    linksList?: { [key: string]: string };

    socialLinks?: { [key: string]: string }[];
}

export default class TitlePageRenderer extends React.PureComponent<TitlePageRendererProps, TitlePageRendererState> {
    public readonly state: TitlePageRendererState = {
        loading: true
    };

    async componentDidMount () {
        async function require<T = ItemObject.Material[]> (path: string, options: { [key: string]: string }) {
            return await fetch(makeRoute(path), new MakeFormData(options).fetchObject)
                .then(response => response.json()) as Response<T>;
        }

        // Get pinned material from database if exist
        const pinnedMaterialResponse = await require(serverRoutesList.searchMaterials,
            { [MaterialSearchOptions.pinned]: "1" });

        // Get list of the latest materials
        const materialsListResponse = await require(serverRoutesList.searchMaterials,
            {
                [MaterialSearchOptions.pinned]: "0",
                [MaterialSearchOptions.tags]: "Новости",
                [RequestOptions.limitSearchResponse]: "10"
            });

        // Get important data
        const importantDataResponse = await require<ItemObject.Variable[]>(serverRoutesList.searchVariables,
            { [VariableOptions.variableName]: "Важная информация" });

        const linksListResponse = await require<ItemObject.Variable[]>(serverRoutesList.searchVariables,
            { [VariableOptions.variableName]: "Полезные ссылки" });

        const socialLinksResponse = await require<ItemObject.Variable[]>(serverRoutesList.searchVariables,
            { [VariableOptions.variableName]: "Социальные сети" });

        // Check if materials, important data and navigation menu items list exist

        if (!materialsListResponse.responseContent || !importantDataResponse.responseContent
            || !linksListResponse.responseContent || !socialLinksResponse.responseContent)
            return this.setState({ error: materialsListResponse.errorCodes?.join(" ") });

        const materialsList = materialsListResponse.responseContent;
        const pinnedMaterial = pinnedMaterialResponse.responseContent
            ? pinnedMaterialResponse.responseContent[0]
            : materialsList.shift();

        try {
            this.setState({
                pinnedMaterial,
                materialsList,

                importantData: importantDataResponse.responseContent[0].value as string,
                linksList: JSON.parse(linksListResponse.responseContent[0].value as string),
                socialLinks: JSON.parse(socialLinksResponse.responseContent[0].value as string)
                // Try to parse nav menu items
            }, () => setTimeout(() => this.setState({ loading: false }), 120));
        } catch {
            this.setState({ error: "invalid-variable" });
        }
    }

    render () {
        const pinnedMaterialPreview = serverRoutesList.getFile(this.state.pinnedMaterial?.preview as string,
            false);
        const remarkPlugins = [ remarkGfm, remarkInlineLinks ];

        const socialIcons = this.state.socialLinks?.reverse().map((block, index) => {
            const SocialIcon = (props: { title: string, link: string; icon: string; open: boolean; }) =>
                <a href={ props.link }
                   className={ classNames("social-icon ui flex relative row center-ai", { open: props.open }) }>
                    <div className="icon-holder ui relative"
                         dangerouslySetInnerHTML={ { __html: props.icon } } />
                    <span className="label">{ props.title }</span>
                </a>;

            return <div className="social-icons-block ui flex row wrap gap" key={ index }>
                {
                    Object.entries(block).map(([ title, link ], index) => {
                        const iconInnerHTML = PredefinedIcons[title as keyof typeof PredefinedIcons].default;
                        let label = title[0].toLocaleUpperCase() + title.slice(1).toLocaleLowerCase();

                        if ([ "email", "phone" ].includes(title)) label = link.split(":").pop() + "";

                        return <SocialIcon title={ label } link={ link } icon={ iconInnerHTML } key={ index }
                                           open={ [ "email", "phone" ].includes(title) } />;
                    })
                }
            </div>;
        });

        const navMenu = this.props.navigationMenu;
        const virtualReception = navMenu["Контакты"] ? navMenu["Контакты"]["Виртуальная приемная"] || "#" : "#";
        const hotLines = navMenu["Контакты"] ? navMenu["Контакты"]["Горячие линии"] || "#" : "#";

        const titleContent = <Condition condition={ this.props.navigationMenu && this.state.pinnedMaterial }>
            <Header { ...this.props } />

            <section className="title-content ui flex center w-100 relative">
                <div className="background-cover ui w-100 h-100 absolute"
                     style={ { backgroundImage: `url("${ pinnedMaterialPreview }")` } } />

                { this.props.mobile &&
                    <HeaderLogoComponent showLogoText={ true } titleName={ this.props.titleName }
                                         className="mobile-title" /> }

                <article className="social-content ui relative flex">
                    <div className="social-icons-holder ui flex relative column gap">
                        { this.state.socialLinks && socialIcons }
                    </div>
                    <div className="external-menu-buttons ui flex column gap">
                        <a href={ virtualReception } className="button-holder">
                            <Button>Виртуальная приемная</Button>
                        </a>
                        <a href={ hotLines } className="button-holder">
                            <Button>Горячие линии</Button>
                        </a>
                    </div>
                </article>
                <article className="pinned-material ui relative">
                    <a href={ appRoutesList.material + this.state.pinnedMaterial?.identifier }
                       className="material-wrapper ui flex">
                        <img src={ pinnedMaterialPreview } alt={ this.state.pinnedMaterial?.title }
                             className="preview-image" />
                        <div className="pinned-material-text ui flex column center-jc">
                            <span className="title">{ this.state.pinnedMaterial?.title }</span>
                            <div className="description">
                                <ReactMarkdown remarkPlugins={ remarkPlugins }>
                                    { this.state.pinnedMaterial?.description as string }
                                </ReactMarkdown>
                            </div>
                        </div>
                    </a>
                </article>
                <article className="important-data ui relative flex column">
                    <span className="title">Важная информация</span>
                    <div className="important-data-text">
                        <ReactMarkdown remarkPlugins={ remarkPlugins }
                                       children={ this.state.importantData as string } />
                    </div>
                </article>
            </section>
        </Condition>;

        const materialsList = <Condition condition={ this.state.materialsList }>
            <section className="latest-materials">
                <div className="latest-materials-wrapper">
                    { this.state.materialsList?.map((material, index) => <article className="material"
                                                                                  key={ index }>
                        <a href={ appRoutesList.material + material.identifier } className="material-wrapper">
                            <img src={ serverRoutesList.getFile(material.preview, false) } alt={ material.title }
                                 className="preview-image" />
                            <div className="material-content">
                                <span className="date">
                                    { convertDate(new Date(Number.parseInt(material.datetime) * 1000)) }
                                </span>
                                <span className="title">{ material.title }</span>
                                <div className="description">
                                    <ReactMarkdown remarkPlugins={ remarkPlugins }>
                                        { material.description }
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </a>
                    </article>) }
                </div>
            </section>
        </Condition>;

        return <div className="ui container title-page">
            <Loading display={ this.state.loading } error={ this.state.error } />
            <div className="content-wrapper ui w-100">
                { titleContent }
                { materialsList }
            </div>
        </div>;
    }
}