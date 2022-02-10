import React from "react";

import "./title-page.scss";

// TODO: Create new renderer for pages (separate to application renderer) to avoid code duplication (Header)
export default function TitlePage () {
    return <div className="title-page ui">
        <div className="ui flex center w-100"
             style={ { height: 2000 } }>123
        </div>
    </div>;
}