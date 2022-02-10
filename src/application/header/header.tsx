import React from "react";
import "./header.scss";
import { ApplicationContext, VariablesStorage } from "../application";
import Button from "../../common/button";
import Navigation from "../navigation";

import Icons from "./icons";
import classNames from "../../lib/class-names";
import getScrollbarWidth from "../../lib/scrollbar-width";
import { Link } from "react-router-dom";
import Condition from "../../common/condition";

/**
 * Component for rendering social icons (like telegram, email, etc.)
 * @constructor
 */
function SocialDataRenderer (props: { socialData: { [key: string]: string }[] }) {
    /**
     * Social icons block renderer
     * @param keyData social icons variable object entry
     * @param index block index in array
     * @internal
     */
    const socialDataBlockEntry = (keyData: [ string, string ], index: number) => {
        // Entries that should be specially processed (like mailto:..., tel:..., etc.)
        const staticEntries = [ "email", "phone" ];

        const title = staticEntries.includes(keyData[0])
            ? keyData[1].split(":").slice(1).join(":")
            : keyData[0][0].toLocaleUpperCase() + keyData[0].slice(1).toLocaleLowerCase();

        // Get icon link
        const icon = Icons[keyData[0] as keyof typeof Icons];
        return <a href={ keyData[1] } className="ui clean flex row gap" target="_blank" key={ index }>
            <span className="icon-holder ui flex center">
                { icon }
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

interface HeaderProps {
    fixed: boolean;

    staticContentRef (ref: HTMLDivElement | null): void;
}

/**
 * Component for creating application header
 * @constructor
 */
export default function Header (props: HeaderProps) {
    const context = React.useContext(ApplicationContext);

    // Application mobile state
    const [ mobile, setMobile ] = React.useState(false);

    // Mobile menu open state
    const [ open, setOpen ] = React.useState(false);

    // Get variables data from context
    const variablesData = context.variablesData as VariablesStorage;

    // References to navigation menu and dynamic-content div
    const navigationMenu = React.useRef<HTMLElement | null>();
    const dynamicContent = React.useRef<HTMLDivElement | null>();

    /**
     * Function for handling window resize
     * @param width navigation menu width (bound)
     */
    const windowResizeHandler = (width: number) => setMobile(window.innerWidth < width);

    React.useLayoutEffect(() => {
        const current = navigationMenu.current;
        if (!current) return;

        // Bind navigation menu width to resize handler
        const handler = windowResizeHandler.bind(null, current.offsetWidth);

        window.addEventListener("resize", handler);
        handler();

        // componentWillUnmount, I think...
        return () => window.removeEventListener("resize", handler);
    }, [ navigationMenu.current ]);

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
                <Link to={ navigationPanel["Контакты"][item] } className="ui clean" key={ key }>
                    <Button className="w-fit" spanClassName="no-text-wrap-ellipsis">{ item }</Button>
                </Link>
            ) }
        </div>;
    }

    return <header className={ classNames("header-component ui flex column center w-100", { mobile }) }>
        { variablesData && <>
            <Condition condition={ mobile }>
                <Button className={ classNames("mobile-menu", { open }) } children="Меню"
                        icon="bi bi-three-dots" onClick={ () => setOpen(!open) } />
            </Condition>

            {/* Static content */ }

            <div className="static-top-container ui flex row center gap-20"
                 ref={ ref => props.staticContentRef(ref) } style={ (!mobile && props.fixed && dynamicContent.current)
                ? { marginBottom: dynamicContent.current.offsetHeight } : {} }>

                <div className="data-container ui flex column gap-20">
                    <div className="website-title ui flex row center gap">
                        <div className="mineco-logo-holder">
                            <img src="/public/mineco-logo-transparent.png" alt="Логотип Министерства" />
                        </div>
                        <h1 className="mineco-title-text">{ variablesData.websiteTitle }</h1>
                    </div>
                    { !mobile && <SocialDataRenderer socialData={ variablesData.socialData } /> }
                </div>

                { !mobile && <ExtraButtons /> }
            </div>

            {/* Dynamic content (navigation menu) */ }

            <div className={ classNames("dynamic-container nav-menu-container ui flex center-ai w-100", {
                fixed: !mobile && props.fixed, open
            }) } style={ (open || !props.fixed) ? {} : { width: `calc(100vw - ${ getScrollbarWidth() }px)` } }
                 ref={ ref => dynamicContent.current = ref }>

                {/* If navigation menu always rendered, application become ve-e-ery slow on phones */ }

                { (!mobile || (mobile && open)) &&
                    <Navigation navigationMenu={ variablesData.navigationPanel } mobile={ mobile }
                                element={ ref => navigationMenu.current = ref }>
                        { mobile && <div className="social-data-holder ui margin-bottom">
                            <SocialDataRenderer socialData={ variablesData.socialData } />
                        </div> }
                    </Navigation> }
            </div>
        </> }
    </header>;
}