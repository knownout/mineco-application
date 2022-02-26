import React from "react";
import { Link, useParams } from "react-router-dom";
import Input from "../../../common/input";
import Loading from "../../../common/loading";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import MakeFormData from "../../../lib/make-form-data";
import { makeRoute, serverRoutesList } from "../../../lib/routes-list";
import { MaterialSearchOptions, RequestOptions, Response } from "../../../lib/types/requests";
import ApplicationBuilder from "../../application-builder";
import { RawMaterialRenderer, useMaterialData } from "../material/material";
import PageFactory from "../page-factory";
import { Material } from "../title-page/latest-materials/latest-materials";
import "./search.scss";

export default function SearchRenderer () {
    const tagSearch = Object.values(useParams<string>()).shift();

    const [ loading, setLoading ] = React.useState(true);
    const [ material, setMaterial ] = React.useState<ItemObject.FullMaterial>();

    const [ error, setError ] = React.useState<any>();

    const [ materialsLoading, setMaterialsLoading ] = React.useState(true);
    const [ loadedMaterials, setLoadedMaterials ] = React.useState<ItemObject.Material[]>([]);

    const [ offset, setOffset ] = React.useState(0);

    const [ foundMaterials, setFoundMaterials ] = React.useState<ItemObject.Material[]>([]);
    const [ searchQuery, setSearchQuery ] = React.useState<string>();

    const lastMaterialRef = React.useRef<HTMLElement | null>(null);

    useMaterialData({ setMaterial, setLoading });

    const offsetStep = 3 * 4;

    const componentScrollHandler = () => {
        if (!lastMaterialRef.current) return;
        const rect = lastMaterialRef.current.getBoundingClientRect();

        const atBottom = (window.innerHeight / 2 - (rect.y + lastMaterialRef.current.offsetHeight / 6) - 20) > 0;
        if (atBottom && !materialsLoading && !error) setOffset(offset => offset + 1);
    };

    React.useLayoutEffect(() => {
        setMaterialsLoading(true);
        if (offset == 0) setLoadedMaterials([]);

        const formData = new MakeFormData({
            [RequestOptions.limitSearchResponse]: offsetStep,
            [RequestOptions.searchOffset]: offsetStep * offset
        });

        if (tagSearch) formData.add({ [MaterialSearchOptions.tags]: tagSearch });

        fetch(makeRoute(serverRoutesList.searchMaterials), formData.fetchObject)
            .then(response => response.json())
            .then((response: Response<ItemObject.Material[]>) => {
                if (response.errorCodes) {
                    if (loadedMaterials.length > 0 || tagSearch) setMaterialsLoading(false);
                    else !tagSearch && setLoading(true);

                    !tagSearch && setError([ "next-materials-fetch-fault", ...response.errorCodes ].join(", "));
                    return;
                }

                const materials = response.responseContent as ItemObject.Material[];

                ApplicationBuilder
                    .waitForImages(materials.map(material => serverRoutesList.getFile(material.preview, false)))
                    .then(() => {
                        setLoadedMaterials(loadedMaterials => [ ...loadedMaterials, ...materials ]);
                        setMaterialsLoading(false);
                    });
            });
    }, [ offset, tagSearch ]);

    React.useEffect(() => {
        if (!searchQuery) return;

        setMaterialsLoading(true);
        setFoundMaterials([]);

        const searchTimeout = setTimeout(() => {
            if (!searchQuery) return;

            fetch(makeRoute(serverRoutesList.searchMaterials), new MakeFormData({
                [MaterialSearchOptions.content]: searchQuery.toLocaleLowerCase()
            }).fetchObject).then(response => response.json()).then((response: Response<ItemObject.Material[]>) => {
                if (!response.responseContent) return setMaterialsLoading(false);
                ApplicationBuilder.waitForImages(response.responseContent.map(material => serverRoutesList
                    .getFile(material.preview, false)))
                    .then(() => {
                        setFoundMaterials(response.responseContent as ItemObject.Material[]);
                        setMaterialsLoading(false);
                    });
            });
        }, 500) as any;

        return () => clearTimeout(searchTimeout);
    }, [ searchQuery, tagSearch ]);

    return <PageFactory onScroll={ componentScrollHandler }
                        loader={ <Loading display={ loading || !loadedMaterials } error={ error } /> }>
        <div className="materials-search ui flex column w-100">
            <Input icon="bi bi-newspaper" placeholder="Поиск материалов" onInput={ setSearchQuery } />
            { material && <RawMaterialRenderer material={ material } /> }
            { loadedMaterials.length > 0 && (!searchQuery || searchQuery.trim().length < 1) &&
                <MaterialsListRenderer materials={ loadedMaterials } last={ ref => lastMaterialRef.current = ref } /> }

            { foundMaterials.length > 0 && searchQuery &&
                <MaterialsListRenderer materials={ foundMaterials } last={ ref => lastMaterialRef.current = ref } /> }

            { searchQuery && foundMaterials.length < 1 &&
                <span className="ui opacity-65 w-100 text-center padding-20 info-label">
                    { materialsLoading && <span>Поиск материалов по запросу <b>«{ searchQuery }»</b>...</span> }
                    { !materialsLoading && <span>По запросу <b>«{ searchQuery }»</b> ничего не найдено</span> }
                </span> }

            { !materialsLoading && !searchQuery && loadedMaterials.length < 1 && tagSearch &&
                <span className="ui opacity-65 w-100 text-center padding-20 info-label">
                    Материалов с тегом <b>«{ tagSearch }»</b> не найдено.{ " " }
                    <Link to={ decodeURI(window.location.pathname).replace(tagSearch, "") } className="g-link">
                        Поиск по всем материалам
                    </Link>
                </span> }

            { materialsLoading &&
                <div className="materials-loading-spinner ui flex row center w-100 h-fit">
                    <div className="wrapper ui w-fit flex row gap">
                        <i className="ui loading-spinner" />
                        <span className="ui opacity-85">Загрузка материалов...</span>
                    </div>
                </div> }
        </div>
    </PageFactory>;
}

function MaterialsListRenderer (props: { materials: ItemObject.Material[], last (ref: HTMLElement | null): void }) {
    return <div className="materials-list ui flex row wrap center-jc">
        { props.materials.map((material, index) => {
            return <Material material={ material } key={ index } reference={ ref =>
                props.materials.length - 1 == index && props.last(ref)
            } />;
        }) }
    </div>;
}
