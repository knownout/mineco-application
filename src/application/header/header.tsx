import React from "react";
import "./header.scss";
import Navigation, { NavigationProps } from "../navigation";
import classNames from "../../lib/class-names";

interface HeaderComponentProps extends Omit<NavigationProps, "mobile"> {
}

interface HeaderComponentState {
    // If false, logo will be rendered without title
    showLogoText: boolean;

    // Initial header content width
    contentWidth: number;

    // Header content width without title
    minifiedContentWidth: number;


    // Is application in mobile state
    mobile: boolean;

    // Is mobile menu open
    mobileMenuOpen: boolean;
}

/**
 * Header logo renderer
 * @internal
 * @constructor
 */
export function HeaderLogoComponent (props: { showLogoText: boolean }) {
    return <a className="header-logo-component ui flex row center gap-20 padding-20 border-radius-10"
              style={ props.showLogoText ? {} : { width: 58 } } href="/">
        { props.showLogoText && <h1 className="page-title">Минсельхозприроды ПМР</h1> }
        <img src="/public/mineco-logo-transparent.png" alt="Логотип Министерства" />
    </a>;
}

/**
 * Header renderer (navigation menu and logotype)
 * @internal
 */
export default class HeaderComponent extends React.PureComponent<HeaderComponentProps, HeaderComponentState> {
    public readonly state: HeaderComponentState = {
        showLogoText: true,
        contentWidth: 0,
        minifiedContentWidth: 0,

        mobile: false,
        mobileMenuOpen: false
    };

    private readonly wrapper = React.createRef<HTMLDivElement>();

    constructor (props: HeaderComponentProps) {
        super(props);

        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.handleMobileMenuChange = this.handleMobileMenuChange.bind(this);
        this.handleWindowClick = this.handleWindowClick.bind(this);
    }

    public componentDidMount () {
        window.addEventListener("resize", this.handleWindowResize);
        window.addEventListener("click", this.handleWindowClick);

        const item = this.wrapper.current;
        if (!item) return;

        // Get contentWidth and minifiedContentWidth
        const getWidth = (i: Element) => (i as HTMLElement).offsetWidth;
        const width = Array.from(item.children).map(e => getWidth(e)).reduce((a, b) => a + b) + 30;
        const logoWidth = (Array.from(item.children)[1] as HTMLElement).offsetWidth;

        this.setState({ contentWidth: width, minifiedContentWidth: width - (logoWidth - 58) },
            this.handleWindowResize);
    }

    public componentWillUnmount () {
        window.removeEventListener("resize", this.handleWindowResize);
        window.removeEventListener("click", this.handleWindowClick);
    }

    public render () {
        return <React.Fragment>
            <header className={
                classNames("header-component ui flex h-fit w-100",
                    { mobile: this.state.mobile, open: this.state.mobileMenuOpen })
            }>
                <div ref={ this.wrapper } className={ classNames(
                    "header-wrapper ui flex row padding w-fit relative gap",
                    { "no-logo": !this.state.showLogoText }
                ) }>
                    <Navigation navigationMenu={ this.props.navigationMenu } mobile={ this.state.mobile } />
                    <HeaderLogoComponent showLogoText={ this.state.mobile || this.state.showLogoText } />
                </div>
            </header>
            { this.state.mobile && <div
                className={ classNames("mobile-menu-button ui flex row center gap padding-20",
                    { open: this.state.mobileMenuOpen }) }
                onClick={ this.handleMobileMenuChange }>

                <span className="text">Меню</span>
                <i className="bi bi-three-dots" />
            </div> }
        </React.Fragment>;
    }

    /**
     * Window resize event handler
     */
    private readonly handleWindowResize = () => {
        this.setState({
            showLogoText: this.state.contentWidth <= window.innerWidth,
            mobile: this.state.minifiedContentWidth > window.innerWidth
        });
    };

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