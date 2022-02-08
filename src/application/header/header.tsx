import React from "react";
import "./header.scss";
import Navigation, { NavigationProps } from "../navigation";
import classNames from "../../lib/class-names";

export interface HeaderComponentProps extends Omit<NavigationProps, "mobile"> {
    wrapper: React.RefObject<HTMLDivElement>;

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

    titleName: string;

    handleMobileMenuChange (): void;
}

/**
 * Header logo renderer
 * @internal
 * @constructor
 */
export function HeaderLogoComponent (props: { showLogoText: boolean, titleName: string; className?: string; }) {
    return <a className={
        classNames("header-logo-component ui flex row center gap-20 padding-20 border-radius-10",
            props.className)
    } style={ props.showLogoText ? {} : { width: 58 } } href="/">
        { props.showLogoText && <h1 className="page-title">{ props.titleName }</h1> }
        <img src="/public/mineco-logo-transparent.png" alt="Логотип Министерства" />
    </a>;
}

/**
 * Header renderer (navigation menu and logotype)
 * @internal
 */
export default class HeaderComponent extends React.PureComponent<HeaderComponentProps> {
    public render () {
        return <React.Fragment>
            <header className={
                classNames("header-component ui flex h-fit w-100",
                    { mobile: this.props.mobile, open: this.props.mobileMenuOpen })
            }>
                <div ref={ this.props.wrapper } className={ classNames(
                    "header-wrapper ui flex row padding w-fit relative gap",
                    { "no-logo": !this.props.showLogoText }
                ) }>
                    <Navigation navigationMenu={ this.props.navigationMenu } mobile={ this.props.mobile } />
                    <HeaderLogoComponent showLogoText={ this.props.mobile || this.props.showLogoText }
                                         titleName={ this.props.titleName } />
                </div>
            </header>
            { this.props.mobile && <div
                className={ classNames("mobile-menu-button ui flex row center gap padding-20",
                    { open: this.props.mobileMenuOpen }) }
                onClick={ this.props.handleMobileMenuChange }>

                <span className="text">Меню</span>
                <i className="bi bi-three-dots" />
            </div> }
        </React.Fragment>;
    }
}