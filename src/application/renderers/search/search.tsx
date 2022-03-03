import React from "react";
import { Link, useParams } from "react-router-dom";
import Input from "../../../common/input";
import Loading from "../../../common/loading";
import Pagination from "../../../common/pagination";
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

    const [ foundMaterials, setFoundMaterials ] = React.useState<ItemObject.Material[]>([]);
    const [ searchQuery, setSearchQuery ] = React.useState<string>();

    const [ offset, setOffset ] = React.useState(0);

    const lastMaterialRef = React.useRef<HTMLElement | null>(null);
    const totalMaterials = React.useRef<number>(0);

    const pageFactoryElement = React.useRef<HTMLDivElement | null>(null);

    useMaterialData({ setMaterial, setLoading });

    const offsetStep = 12;

    React.useLayoutEffect(() => {
        setMaterialsLoading(true);

        const formData = new MakeFormData({
            [RequestOptions.limitSearchResponse]: offsetStep,
            [RequestOptions.searchOffset]: offsetStep * offset
        });

        if (tagSearch) formData.add({ [MaterialSearchOptions.tags]: tagSearch });

        fetch(makeRoute(serverRoutesList.searchMaterials), formData.fetchObject)
            .then(response => response.json())
            .then((response: Response<ItemObject.Material[]>) => {
                if (response.errorCodes) {
                    if (loadedMaterials.length > 0 || tagSearch) {
                        setLoadedMaterials([]);
                        setMaterialsLoading(false);
                    } else !tagSearch && setLoading(true);

                    !tagSearch && setError([ "next-materials-fetch-fault", ...response.errorCodes ].join(", "));
                    return;
                }

                const materials = response.responseContent as ItemObject.Material[];

                ApplicationBuilder
                    .waitForImages(materials.map(material => serverRoutesList.getFile(material.preview, false)))
                    .then(() => {
                        setLoadedMaterials(materials);

                        if (pageFactoryElement.current)
                            pageFactoryElement.current.scrollTo({ top: 20, behavior: "smooth" });
                        setMaterialsLoading(false);
                    });
            });
    }, [ offset, tagSearch ]);

    React.useLayoutEffect(() => {
        if (!searchQuery) return;

        setMaterialsLoading(true);
        // setFoundMaterials([]);

        const searchTimeout = setTimeout(() => {
            if (!searchQuery) return;

            fetch(makeRoute(serverRoutesList.searchMaterials), new MakeFormData({
                [MaterialSearchOptions.content]: searchQuery.toLocaleLowerCase()
            }).fetchObject).then(response => response.json()).then((response: Response<ItemObject.Material[]>) => {
                if (!response.responseContent) return setMaterialsLoading(false);
                ApplicationBuilder.waitForImages(response.responseContent.map(material => serverRoutesList
                    .getFile(material.preview, false)))
                    .then(() => {
                        setOffset(0);
                        setFoundMaterials((response.responseContent as ItemObject.Material[]).filter(e => e.tags.length > 0));
                        setMaterialsLoading(false);
                    });
            });
        }, 1000) as any;

        return () => {
            clearTimeout(searchTimeout);
            setMaterialsLoading(false);
        };
    }, [ searchQuery, tagSearch ]);

    React.useLayoutEffect(() => {
        fetch(makeRoute(serverRoutesList.getTotalMaterials)).then(response => response.json())
            .then((response: Response<number>) => {
                if (response.responseContent) totalMaterials.current = response.responseContent;
                else {
                    setLoading(true);
                    setError("no-total-count");
                }
            });
    }, []);

    const materialsObject = loadedMaterials.length > 0 && (!searchQuery || searchQuery.trim().length < 1) ?
        loadedMaterials : foundMaterials.length > 0 && searchQuery ? foundMaterials.slice(0, offsetStep) : null;

    return <PageFactory
        loader={ <Loading
            display={ loading || !loadedMaterials || (offset == 0 && materialsLoading && !searchQuery && !loadedMaterials.length) }
            error={ error } /> }
        ref={ pageFactoryElement }>
        <div className="materials-search ui flex center-ai column w-100 limit-1280">
            { material && <RawMaterialRenderer material={ material } /> }

            <Input icon="bi bi-newspaper" placeholder="Поиск материалов" onInput={ setSearchQuery } />
            { searchQuery && loadedMaterials.length > 0 && foundMaterials.length > loadedMaterials.length &&
                <span className="ui w-100 text-center padding-20 margin opacity-65">
                    По запросу <b>«{ searchQuery }»</b> найдено { foundMaterials.length } материалов, отображено - { loadedMaterials.length },
                    уточните запрос, чтобы уменьшить количество результатов
                </span> }

            { materialsObject && totalMaterials.current &&
                <MaterialsListRenderer materials={ materialsObject }
                                       totalPages={ Math.ceil(searchQuery ? 1 : totalMaterials.current / offsetStep) }
                                       last={ ref => lastMaterialRef.current = ref }
                                       onPageChange={ page => setOffset(page - 1) } /> }

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

interface MaterialsListRendererProps
{
    materials: ItemObject.Material[];
    totalPages: number;

    last (ref: HTMLElement | null): void;

    onPageChange? (page: number): void;
}

function MaterialsListRenderer (props: MaterialsListRendererProps) {
    console.log(props);
    const MaterialsListContainer: React.FC = () => <div className="ui materials-container flex row wrap gap-20 center">
        { props.materials.map((material, index) => {
            return <Material material={ material } key={ index } reference={ ref =>
                props.materials.length - 1 == index && props.last(ref)
            } wordsLimit={ 40 } />;
        }) }
    </div>;

    return <div className="materials-list ui flex row wrap center-jc">
        { props.totalPages > 1 ?
            <Pagination total={ props.totalPages } splitBy={ 4 } onPageChange={ props.onPageChange }
                        topSwitches={ true }>
                <MaterialsListContainer />
            </Pagination> : <MaterialsListContainer /> }
    </div>;
}
