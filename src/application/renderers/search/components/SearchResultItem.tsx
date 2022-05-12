/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import { StringProcessor } from "@knownout/lib";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { ItemObject } from "../../../../control-panel/components/root-form/item-object-renderers/renderers";
import convertDate from "../../../../lib/convert-date";
import { appRoutesList, makeRoute, serverRoutesList } from "../../../../lib/routes-list";
import remarkConfig from "../../remark-config";

export default function SearchResultItem (props: { material: ItemObject.Material }) {
    const getDescription = (description: string) => {
        const stringProcessor = new StringProcessor(description);
        stringProcessor.clean;
        stringProcessor.limitWordsCount(20);

        return stringProcessor.entry;
    };

    const material = <div className="search-result-item ui flex column">
        { props.material.preview !== "none" &&
            <div className="preview-image ui w-100"
                 style={ {
                     backgroundImage: `url("${ serverRoutesList.getFile(
                         props.material.preview, false) }")`,
                     height: 300
                 } } /> }
        <div className="material-meta ui padding-20 flex column gap">
            <span className="item-title ui fz-20 fw-700">{ props.material.title }</span>
            <span className="material-date ui opacity-65">
                                { convertDate(new Date(parseInt(props.material.datetime) * 1000)) }
                            </span>
            <div className="material-description">
                <ReactMarkdown remarkPlugins={ remarkConfig }>
                    { getDescription(props.material.description) }
                </ReactMarkdown>
            </div>
        </div>
    </div>;

    return <Link to={ makeRoute(props.material.identifier, appRoutesList.material) }
                 className="ui clean search-result-item-holder">
        { material }
    </Link>;
}
