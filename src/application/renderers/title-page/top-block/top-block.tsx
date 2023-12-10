/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React from "react";

import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import Button from "../../../../common/button";
import Carousel from "../../../../common/carousel";

import { ItemObject } from "../../../../control-panel/components/root-form/item-object-renderers/renderers";
import convertDate from "../../../../lib/convert-date";
import { appRoutesList, serverRoutesList } from "../../../../lib/routes-list";

import { ApplicationContext } from "../../../application";

import RemarkConfig from "../../remark-config";

import "./top-block.scss";
import { StringProcessor } from "@knownout/lib";
import remarkConfig from "../../remark-config";

/**
 * Component for rendering pinned content (pinned material
 * and important data variable values)
 * @constructor
 * @internal
 */


interface MaterialProps {
    material: ItemObject.Material;
    wordsLimit?: number;

    reference?(ref: HTMLAnchorElement | null): void;
}

export function Material(props: MaterialProps) {
    const previewImage = serverRoutesList.getFile(props.material.preview, false);

    const description = props.material.description.replace(/<[^>/]+>(.*)<\/[^>]>/g, "$1");
    const stringProcessor = new StringProcessor(description);

    stringProcessor.clean;
    stringProcessor.limitWordsCount(15);

    // return <Link to={ appRoutesList.material + props.material.identifier } className="ui clean material-link w-fit"
    //              ref={ ref => props.reference && props.reference(ref) }>
    //     <article className="material ui">
    //         <div className="preview-image" style={ { backgroundImage: `url(${ previewImage })` } } />
    //         <div className="material-data ui flex column gap-5 lh-22 padding-20">
    //         <span className="date ui opacity-65">
    //                 { convertDate(new Date(parseInt(props.material.datetime) * 1000)) }
    //             </span>
    //             <span className="material-title ui fz-20 fw-700 lh-26">{ props.material.title }</span>

    //             {/* <div className="description ui clean">
    //                 <ReactMarkdown remarkPlugins={ remarkConfig }
    //                                children={ stringProcessor.entry } />
    //             </div> */}
    //         </div>
    //         <div className="extra-controls ui absolute flex row">
    //             <Button>Читать далее</Button>
    //         </div>
    //     </article>
    // </Link>;

    return <div className="topblock_right_list_item" >
        <div className="topblock_right_list_item_dot">
            {/* <img src="/public/icons/bookmark.svg" alt="" />  */}
            <div className="topblock_right_list_item_dot_dot"></div>
        </div>
        <Link to={appRoutesList.material + props.material.identifier} className="topblock_right_list_item_title">
            <div className="topblock_right_list_item_date">{convertDate(new Date(parseInt(props.material.datetime) * 1000), false, true)}</div>
            {props.material.title}. <ReactMarkdown remarkPlugins={remarkConfig} className="topblock_right_list_item_description"
                children={stringProcessor.entry} />
        </Link>
    </div>
}

export default function TopContentBlock(props: { pinnedMaterial: ItemObject.Material, materials: ItemObject.Material[] }) {
    const context = React.useContext(ApplicationContext);


    const pinnedMaterialElement = React.useRef<HTMLElement | null>();

    // Calculate top block important data section height

    const importantData = context.variablesData?.importantData;
    if (!importantData) return null;

    // Pinned material preview image link
    const previewImage = serverRoutesList.getFile(props.pinnedMaterial.preview, false);
    const backgroundImage = props.pinnedMaterial.background && props.pinnedMaterial.background != "none"
        ? serverRoutesList.getFile(props.pinnedMaterial.background, false)
        : previewImage;

    // Convert importantData items to JSX elements (for carousel)
    

    return <div className="pinned-data-block ui w-100">

        <Link to={appRoutesList.material + props.pinnedMaterial.identifier} style={{ backgroundImage: `url(${previewImage})` }} className="ui clean pinned-material-link  topblock">

            {/* Pinned material renderer */}
            <section className="pinned-material ui flex column relative topblock_container"
                ref={ref => pinnedMaterialElement.current = ref}>
                <div className="material-title ui flex gap column topblock_content">
                    <span className="title">{props.pinnedMaterial.title}</span>
                    <span className="date ui opacity-50">
                        {convertDate(new Date(parseInt(props.pinnedMaterial.datetime) * 1000))}
                    </span>
                    <div className="description ui flex column relative">
                        <ReactMarkdown remarkPlugins={RemarkConfig} children={props.pinnedMaterial.description} />
                    </div>
                </div>
            </section>
        </Link>

        {/* Important data variable values renderer through Carousel */}
        {/* <section className="important-data ui flex relative gap-20"
                 style={ topBlockHeight ? { maxHeight: topBlockHeight - 80 } : {} }>
            <span className="section-title">Важная информация</span>
            <div className="blocks-wrapper ui flex row relative">
                { carouselItems && <Carousel items={ carouselItems } /> }
            </div>
            <Link to={ "/economic-efficiency-indicators-infographic" } className="ui clean infographics">
                <Button>
                    Инфографика показателей экономической эффективности сельскохозяйственного производства за 2017-2021
                    года
                </Button>
            </Link>

        </section> */}

        <div className="topblock_right">
            <div className="topblock_right_title">
                Последние новости
            </div>

            <div className="topblock_right_list">
                {props.materials.slice(0, 8).map((material, index) =>
                    <Material material={material} key={index} />)}
                <div className="topblock_right_list_item topblock_right_list_item_all" >
                    <div className="topblock_right_list_item_dot">
                        {/* <img src="/public/icons/bookmark.svg" alt="" />  */}
                        <div className="topblock_right_list_item_dot_dot"></div>
                    </div>
                    <Link to="search/Новости" className="topblock_right_list_item_title  topblock_right_list_item_all_title">
                        Все новости...
                    </Link>
                </div>
                {/* {importantData.map((el) => {
                    console.log(el)

                    return (
                        <div className="topblock_right_list_item">

                            <ReactMarkdown remarkPlugins={RemarkConfig} >{el}</ReactMarkdown>
                        </div>
                    )
                })} */}
            </div>
            {/* <div className="topblock_right_link">
                <Link to="search/Новости" className="ui clean color-white materials-archive-link">
                    <Button className="materials-archive-button">Перейти в архив новостей</Button>
                </Link>
            </div> */}
        </div>
    </div >;
}
