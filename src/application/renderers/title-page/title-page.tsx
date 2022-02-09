import React from "react";
import Header from "../../header";

import "./title-page.scss";

// TODO: Create new renderer for pages (separate to application renderer) to avoid code duplication (Header)
export default function TitlePage () {
    const [ scrollHeight, setScrollHeight ] = React.useState(0);

    const componentScrollHandler = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        setScrollHeight((event.target as HTMLDivElement).scrollTop);
    };

    return <div className="title-page ui container block scroll-y" onScroll={ componentScrollHandler }>
        <Header scrollHeight={ scrollHeight } />
        <div className="ui flex center w-100"
             style={ { height: 2000 } }>123
        </div>
    </div>;
}