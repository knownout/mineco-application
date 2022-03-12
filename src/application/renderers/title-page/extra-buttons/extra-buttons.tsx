import React from "react";
import { Link } from "react-router-dom";
import classNames from "../../../../lib/class-names";

import { serverRoutesList } from "../../../../lib/routes-list";
import { VariablesStorage } from "../../../application";

import "./extra-buttons.scss";

/**
 * Component for rendering title page extra buttons
 * @internal
 * @constructor
 */
export default function ExtraButtons (props: { buttons: VariablesStorage["extraButtons"] }) {
    if (Object.keys(props.buttons).length < 1) return null;

    /**
     * Component for rendering single extra button
     * @internal
     * @constructor
     */
    function ExtraButton (props: { title: string; image: string | null; link: string; icon: string | null, d?: boolean }) {
        const backgroundImage = props.image && `url("${ serverRoutesList.getFile(props.image, false) }")`;
        const icon = props.icon && serverRoutesList.getFile(props.icon, false);

        return <Link to={ props.link }
                     className={ classNames("extra-button ui flex row relative clean color-white",
                         { disabled: props.d }) }>
            { backgroundImage &&
                <div className="background-image ui absolute block w-100 h-100" style={ { backgroundImage } } /> }
            <span className="button-title relative flex column gap ui fw-700">
                <span className="ui fw-700">{ props.title }</span>
                { props.d && <span className="ui fw-700 opacity-65 fz-18">Недоступно в данный момент</span> }
            </span>
            { icon &&
                <img src={ icon } alt={ props.title } className="button-icon ui flex relative margin-left-auto" /> }
        </Link>;
    }

    const buttons = Object.entries(props.buttons);
    const defaultWidth = buttons.length >= 3 ? 70 : 100;

    // Get first two long buttons and one short (if exist)
    const longButtons = buttons.slice(0, 2);
    const shortButton = buttons.length >= 3 ? buttons[2] : null;

    const renderButton = (button: typeof buttons[0], index: number = Math.random()) =>
        <ExtraButton title={ button[0] } image={ button[1][1] } link={ button[1][2] } icon={ button[1][0] }
                     key={ index } d={ button[1][3] } />;

    // Render buttons about its count
    return <div className="extra-buttons-container ui flex column w-100 relative padding-20 gap-20">
        <div className="extra-buttons-block ui limit-1280">
            <div className="long-buttons-holder ui flex column gap-20" style={ { width: defaultWidth + "%" } }>
                { longButtons.map(renderButton) }
            </div>
            { shortButton &&
                <div className="short-button-holder ui flex" style={ { width: (100 - defaultWidth) + "%" } }>
                    { renderButton(shortButton) }
                </div> }
        </div>
        { buttons.length > 3 && <div className="rest-buttons-block ui flex column limit-1080 gap-20 margin-top">
            { buttons.slice(3).map(renderButton) }
        </div> }
    </div>;
}
