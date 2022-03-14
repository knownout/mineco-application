import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { ItemObject } from "../../../../control-panel/components/root-form/item-object-renderers/renderers";
import convertDate from "../../../../lib/convert-date";
import { appRoutesList, makeRoute, serverRoutesList } from "../../../../lib/routes-list";
import { setWordsLimit } from "../../../../lib/words-limit";
import remarkConfig from "../../remark-config";

export default function SearchResultItem (props: { material: ItemObject.Material }) {
    const getDescription = (description: string) =>
        setWordsLimit(description.replace(/<[^>]+>/g, "").trim(), 40);

    const material = <div className="search-result-item ui flex column">
        <div className="preview-image ui w-100"
             style={ {
                 backgroundImage: `url("${ serverRoutesList.getFile(props.material.preview, false) }")`,
                 height: 300
             } } />
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
