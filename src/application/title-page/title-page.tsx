import React from "react";
import "./title-page.scss"
import { ItemObject } from "../../control-panel/components/root-form/item-object-renderers/renderers";
import MakeFormData from "../../lib/make-form-data";
import { MaterialSearchOptions, RequestOptions, Response } from "../../lib/types/requests";
import { makeRoute, serverRoutesList } from "../../lib/routes-list";
import Loading from "../../common/loading";

export default function TitlePage () {
    const [ [ loading, setLoading ], [ error, setError ] ] = [
        React.useState(true),
        React.useState<string>()
    ]

    const [ pinnedMaterial, setPinnedMaterial ] = React.useState<ItemObject.Material>();
    const [ latestMaterials, setLatestMaterials ] = React.useState<ItemObject.Material[]>();

    React.useEffect(() => {
        let formData = new MakeFormData({
            [MaterialSearchOptions.pinned]: "1",
            [RequestOptions.limitSearchResponse]: 1
        });

        fetch(makeRoute(serverRoutesList.searchMaterials), formData.fetchObject)
            .then(response => response.json())
            .then((response: Response<ItemObject.Material[]>) => {
                if (response.success) setPinnedMaterial((response.responseContent as ItemObject.Material[])[0])
            });

        formData.remove(MaterialSearchOptions.pinned).add({ [RequestOptions.limitSearchResponse]: 10 });
        fetch(makeRoute(serverRoutesList.searchMaterials), formData.fetchObject)
            .then(response => response.json()).catch(error => setError(error))
            .then((response: Response<ItemObject.Material[]>) => {
                if (!response.success) return setError("no-materials");
                const materials = response.responseContent as ItemObject.Material[];

                if (!pinnedMaterial) setPinnedMaterial(materials.shift());
                if (materials.length > 0) setLatestMaterials(materials);

                console.log(latestMaterials);
                setLoading(false);
            });
    }, [ "init" ]);

    return <div className="title-page ui container">
        <Loading display={ loading } error={ error } />
        <div className="ui content-wrapper flex column w-100">
            <header className="control-panel ui flex center nowrap">
                <div className="header-content-wrapper ui limit-1920 flex row w-100 center-ai">
                    <div className="ui flex center-ai row h-100 w-fit title-content gap">
                        <div className="ui grid center h-100 w-fit icon-holder">
                            <img src="/public/mineco-logo-transparent.png" alt="Логотип Министерства" />
                        </div>
                        <span className="title-text">Минсельхоз ПМР</span>
                    </div>

                    <div className="ui flex row h-fit w-fit menu-content">
                        <div className="dev__nav-button">Документы</div>
                    </div>
                </div>
            </header>
        </div>
    </div>
}