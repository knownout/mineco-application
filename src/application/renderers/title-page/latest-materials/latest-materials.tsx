/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import { StringProcessor } from "@knownout/lib";
import React from "react";

import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import Button from "../../../../common/button";

import { ItemObject } from "../../../../control-panel/components/root-form/item-object-renderers/renderers";
import convertDate from "../../../../lib/convert-date";

import { appRoutesList, serverRoot, serverRoutesList } from "../../../../lib/routes-list"

import remarkConfig from "../../remark-config";

import "./latest-materials.scss";
import Carousel from "../../../../common/carousel/carousel";
import { ApplicationContext } from "../../../application";

/**
 * Component for rendering the latest materials list
 * @constructor
 * @internal
 */
export default function MaterialsList(props: { materials: ItemObject.Material[] }) {

    const context = React.useContext(ApplicationContext);

    // Calculate top block important data section height

    const importantData = context.variablesData?.importantData;
    /**
     * Window resize event handler for recalculating materials limit
     */
    const carouselItems = importantData?.map(item =>
        <article className="important-data-block ui flex column relative">
            <ReactMarkdown remarkPlugins={remarkConfig}>{item}</ReactMarkdown>
        </article>);



    return <>
        <section className="important-data">
                <Link to={"/economic-efficiency-indicators-infographic"} className="important-data_link">
                <Button>
                    Инфографика показателей экономической эффективности сельскохозяйственного производства за 2017-2021
                    года
                    <img src={`${serverRoot}public/chart.png`} />
                </Button>
                
            </Link>
            <div className="important-data_carousel">
                {carouselItems && <Carousel items={carouselItems} />}

            
            </div>

        </section>

      
    </>;
}

interface MaterialProps {
    material: ItemObject.Material;
    wordsLimit?: number;

    reference?(ref: HTMLAnchorElement | null): void;
}

/**
 * Material renderer for latest materials
 * list renderer
 *
 * @constructor
 * @internal
 */
export function Material(props: MaterialProps) {
    const previewImage = serverRoutesList.getFile(props.material.preview, false);

    const description = props.material.description.replace(/<[^>/]+>(.*)<\/[^>]>/g, "$1");
    const stringProcessor = new StringProcessor(description);

    stringProcessor.clean;
    stringProcessor.limitWordsCount(props.wordsLimit || 60);

    return <Link to={appRoutesList.material + props.material.identifier} className="ui clean material-link w-fit"
        ref={ref => props.reference && props.reference(ref)}>
        <article className="material ui">
            <div className="preview-image" style={{ backgroundImage: `url(${previewImage})` }} />
            <div className="material-data ui flex column gap-5 lh-22 padding-20">
                <span className="date ui opacity-65">
                    {convertDate(new Date(parseInt(props.material.datetime) * 1000))}
                </span>
                <span className="material-title ui fz-20 fw-700 lh-26">{props.material.title}</span>

                {/* <div className="description ui clean">
                    <ReactMarkdown remarkPlugins={ remarkConfig }
                                   children={ stringProcessor.entry } />
                </div> */}
            </div>
            <div className="extra-controls ui absolute flex row">
                <Button>Читать далее</Button>
            </div>
        </article>
    </Link>;
}
