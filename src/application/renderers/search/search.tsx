import React from "react";
import Loading from "../../../common/loading";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import MakeFormData from "../../../lib/make-form-data";
import { makeRoute, serverRoutesList } from "../../../lib/routes-list";
import { RequestOptions, Response } from "../../../lib/types/requests";
import ApplicationBuilder from "../../application-builder";
import { RawMaterialRenderer, useMaterialData } from "../material/material";
import PageFactory from "../page-factory";
import { Material } from "../title-page/latest-materials/latest-materials";
import "./search.scss";

export default function SearchRenderer () {
    const [ loading, setLoading ] = React.useState(true);
    const [ material, setMaterial ] = React.useState<ItemObject.FullMaterial>();
    const [ error, setError ] = React.useState<any>();

    const [ materialsLoading, setMaterialsLoading ] = React.useState(true);

    const [ loadedMaterials, setLoadedMaterials ] = React.useState<ItemObject.Material[]>([]);
    const [ offset, setOffset ] = React.useState(0);

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

        fetch(makeRoute(serverRoutesList.searchMaterials), new MakeFormData({
            [RequestOptions.limitSearchResponse]: offsetStep,
            [RequestOptions.searchOffset]: offsetStep * offset
        }).fetchObject).then(response => response.json()).then((response: Response<ItemObject.Material[]>) => {
            if (response.errorCodes) {
                setError([ "next-materials-fetch-fault", ...response.errorCodes ].join(", "));

                if (loadedMaterials.length > 0) setMaterialsLoading(true);
                else setLoading(true);

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
    }, [ offset ]);

    return <PageFactory onScroll={ componentScrollHandler }
                        loader={ <Loading display={ loading || !loadedMaterials } error={ error } /> }>
        <div className="materials-search ui flex column w-fit h-fit">
            { material && <RawMaterialRenderer material={ material } /> }
            { loadedMaterials.length > 0 &&
                <MaterialsListRenderer materials={ loadedMaterials } last={ ref => lastMaterialRef.current = ref } /> }
            { materialsLoading &&
                <div className="materials-loading-spinner ui flex row gap center w-100 h-fit margin-bottom">
                    <i className="ui loading-spinner" />
                    <span className="ui opacity-85">Загрузка материалов...</span>
                </div> }
        </div>
    </PageFactory>;
}

function MaterialsListRenderer (props: { materials: ItemObject.Material[], last (ref: HTMLElement | null): void }) {
    return <div className="materials-list ui flex row wrap limit-1280 center-jc">
        { props.materials.map((material, index) => {
            return <Material material={ material } key={ index } reference={ ref =>
                props.materials.length - 1 == index && props.last(ref)
            } />;
        }) }
    </div>;
}
