/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React, { useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../../../common/button";
import Loading from "../../../common/loading";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import searchLinkParameters from "../../../lib/search-link-parameters";
import PageFactory from "../page-factory";
import MaterialsSearchBlock from "./components/MaterialsSearchBlock";
import PaginationRenderer from "./components/PaginationRenderer";
import SearchPageMaterial from "./components/SearchPageMaterial";
import SearchResultItem from "./components/SearchResultItem";
import "./search.scss";
import useMaterialsSearch from "./use-materials-search";

export default function SearchRenderer () {
    const [ loading, setLoading ] = React.useState(true);
    const [ materials, setMaterials ] = React.useState<ItemObject.Material[]>([]);
    const [ error, setError ] = React.useState<any>();
    const [ query, setQuery ] = React.useState<string>();

    const [ totalMaterials, setTotalMaterials ] = React.useState(0);

    const pathname = useLocation().pathname;
    const setPageRef = useRef<(page: number) => void>();
    const mounted = useRef(false);
    const pageFactory = useRef<HTMLDivElement | null>(null);

    const params = searchLinkParameters(pathname);
    const materialsPerPage = 12;

    useLayoutEffect(() => {
        mounted.current = true;

        useMaterialsSearch({
            materialsPerPage,
            setTotalMaterials,

            pathname, mounted, query,
            setLoading, setError, setMaterials
        }).then(() => setPageRef.current && setPageRef.current(params.page));

        return () => {
            mounted.current = false;
        };
    }, [ params.tag, params.page ]);

    const materialsList = <PaginationRenderer total={ Math.ceil(totalMaterials / materialsPerPage) } tag={ params.tag }
                                              setPageRef={ setPageRef } onPageChange={ () => {
        if (!pageFactory.current) return;

        if (pageFactory.current.scrollTop >= pageFactory.current.scrollHeight / 2)
            pageFactory.current.scrollTo({ top: 0, behavior: "smooth" });
    } }>
        { materials.map(material =>
            <SearchResultItem material={ material } key={ material.identifier } />) }
    </PaginationRenderer>;

    const onMaterialsSearch = () => {
        useMaterialsSearch({
            materialsPerPage,
            setTotalMaterials,

            pathname, mounted, query,
            setLoading, setError, setMaterials
        });
    };

    return <PageFactory loader={ <Loading display={ loading } error={ error } /> } ref={ pageFactory }>
        <SearchPageMaterial tag={ params.tag } />
        <div className="search-result ui flex center-ai w-100 gap">
            <MaterialsSearchBlock setQuery={ setQuery } onSearch={ onMaterialsSearch } query={ query } />

            { Boolean(materials.length) ? materialsList : <div className="no-materials ui flex column gap limit-460">
                <div className="warning-title ui flex row gap fz-20">
                    <i className="bi bi-diagram-3" />
                    <span className="warning-title-text ui fw-700">Ничего не найдено</span>
                </div>

                <span className="description">
                    В данном разделе не найдено ни одного материала, перейдите на вкладку <b>«Все новости»</b> или
                    обратитесь к администратору, если считаете это сообщение ошибкой
                </span>

                <div className="buttons-holder ui flex row gap wrap center-ai">
                    <Link to={ "/" } className="ui clean">
                        <Button>На главную</Button>
                    </Link>
                    <Link to={ "/search" } className="ui clean padding-20">Все новости</Link>
                </div>
            </div> }
        </div>
    </PageFactory>;
}
