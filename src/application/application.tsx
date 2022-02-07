import React from "react";
import { Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import TitlePageRenderer from "./page-renderers/title-page-renderer";
import { ItemObject } from "../control-panel/components/root-form/item-object-renderers/renderers";
import { makeRoute, serverRoutesList } from "../lib/routes-list";
import { Response, VariableOptions } from "../lib/types/requests";
import MakeFormData from "../lib/make-form-data";
import Loading from "../common/loading";

interface IApplicationState {
    navigationMenu: { [key: string]: { [key: string]: string } };
    titleName: string;

    // Initial header content width
    contentWidth: number;

    // Header content width without title
    minifiedContentWidth: number;

    showLogoText: boolean;

    // Is application in mobile state
    mobile: boolean;

    // Is mobile menu open
    mobileMenuOpen: boolean;

    loading: boolean;
    error?: any;
}

/**
 * Application root component
 * @inner
 */
export default class Application extends React.PureComponent<{}, IApplicationState> {
    public readonly state: IApplicationState = {
        navigationMenu: {},
        titleName: "Минсельхозприроды ПМР",

        contentWidth: 0,
        minifiedContentWidth: 0,

        showLogoText: true,

        mobile: false,
        mobileMenuOpen: false,

        loading: true
    };

    private readonly wrapper = React.createRef<HTMLDivElement>();

    constructor (props: {}) {
        super(props);

        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.handleMobileMenuChange = this.handleMobileMenuChange.bind(this);
        this.handleWindowClick = this.handleWindowClick.bind(this);
    }

    async componentDidMount () {
        window.addEventListener("resize", this.handleWindowResize);
        window.addEventListener("click", this.handleWindowClick);

        async function require<T = ItemObject.Material[]> (path: string, options: { [key: string]: string }) {
            return await fetch(makeRoute(path), new MakeFormData(options).fetchObject)
                .then(response => response.json()) as Response<T>;
        }

        // Get navigation menu items
        const navigationMenuResponse = await require<ItemObject.Variable[]>(serverRoutesList.searchVariables,
            { [VariableOptions.variableName]: "Панель навигации" });

        const titleNameResponse = await require<ItemObject.Variable[]>(serverRoutesList.searchVariables,
            { [VariableOptions.variableName]: "Название сайта" });

        if (!navigationMenuResponse.responseContent) return this.setState({
            error: navigationMenuResponse.errorCodes?.join(" ")
        });

        if (titleNameResponse.responseContent)
            this.setState({ titleName: String(titleNameResponse.responseContent[0].value) });

        try {
            this.setState({
                navigationMenu: JSON.parse(navigationMenuResponse.responseContent[0].value as string),
                loading: false
            });
        } catch {
            this.setState({ error: "invalid-variable" });
        }

        // Get contentWidth and minifiedContentWidth
        const getContentWidth = () => {
            const item = this.wrapper.current;
            if (!item) return;

            const getWidth = (i: Element) => (i as HTMLElement).offsetWidth;
            const width = Array.from(item.children).map(e => getWidth(e)).reduce((a, b) => a + b) + 30;
            const logoWidth = (Array.from(item.children)[1] as HTMLElement).offsetWidth;

            this.setState({ contentWidth: width, minifiedContentWidth: width - (logoWidth - 58) },
                this.handleWindowResize);
        };

        const interval = setInterval(() => {
            if (this.state.contentWidth === 0) getContentWidth();
            else clearInterval(interval);
        }, 100);
    }

    render () {
        const { loading: _, ...rest } = this.state;

        return <React.Fragment>
            <Helmet>
                <meta name="description"
                      content="Министерство сельского хозяйства и природных ресурсов"
                />

                <link rel="apple-touch-icon" href="/public/mineco-logo-448x252.png" />
                <title>{ this.state.titleName }</title>
                <link rel="icon" href="/public/favicon.ico" />
            </Helmet>

            <React.StrictMode>
                <Loading display={ this.state.loading } error={ this.state.error } />
                <Routes>
                    <Route path="/" element={
                        <TitlePageRenderer { ...rest } wrapper={ this.wrapper }
                                           handleMobileMenuChange={ this.handleMobileMenuChange } /> }
                    />
                    <Route path="/dev" element={ <div>Dev</div> } />
                </Routes>
            </React.StrictMode>
        </React.Fragment>;
    }

    public componentWillUnmount () {
        window.removeEventListener("resize", this.handleWindowResize);
        window.removeEventListener("click", this.handleWindowClick);
    }

    /**
     * Window resize event handler
     */
    private readonly handleWindowResize = () => this.setState({
        showLogoText: this.state.contentWidth <= window.innerWidth,
        mobile: this.state.minifiedContentWidth > window.innerWidth
    });


    /**
     * Mobile menu open/close event handler
     */
    private readonly handleMobileMenuChange = () => this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen });

    /**
     * Window onClick event handler, hides mobile menu if clicked
     * outside of specific objects
     */
    private readonly handleWindowClick = (event: MouseEvent) => {
        if (!this.state.mobileMenuOpen) return;
        const target = event.target as HTMLElement;

        if (!target.closest || target.closest("header.header-component")) return;
        if (target.closest("div.mobile-menu-button")) return;

        this.setState({ mobileMenuOpen: false });
    };
}