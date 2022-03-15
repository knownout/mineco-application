import Blocks from "editorjs-blocks-react-renderer";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import Button from "../../../common/button";
import Loading from "../../../common/loading";
import ShareComponent from "../../../common/share";

import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import classNames from "../../../lib/class-names";
import convertDate from "../../../lib/convert-date";
import MakeFormData from "../../../lib/make-form-data";
import mergeImages from "../../../lib/merge-images";

import { makeRoute, serverRoutesList } from "../../../lib/routes-list";
import { RequestOptions, Response } from "../../../lib/types/requests";
import { ApplicationContext } from "../../application";

import ApplicationBuilder from "../../application-builder";

import { SocialDataRenderer } from "../../header/header";

import NotFoundPage from "../not-found";
import PageFactory from "../page-factory";

import "./material.scss";
import {
    CarouselRenderer,
    FileRenderer,
    HeaderRenderer,
    RawHTMLRenderer,
    TableRenderer,
    WarningRenderer
} from "./renderers";

interface UseMaterialDataProps
{
    identifier?: string;

    setMaterial? (material: ItemObject.FullMaterial | undefined): void;

    setError? (error: any): void;

    setLoading? (state: boolean): void;
}

export function useMaterialData ({ setMaterial, setError, setLoading, identifier }: UseMaterialDataProps) {
    // Get material identifier from URL
    const idx = identifier ? identifier : useLocation().pathname.split("/").pop();

    /**
     * Function for processing material data
     * form server response
     */
    const useMaterialContent = React.useCallback((response?: Response<ItemObject.FullMaterial>) => {
        const content = response?.responseContent;

        if (!content || !content.data) {
            setError && setError(response ? response.errorCodes : "server-fault");
            setLoading && setLoading(false);
            return;
        }

        // Transform blocks
        const clean = (s: any) => String(s).replace(/([^A-zА-я0-9])/g, "").trim();
        if (content.content.blocks[0]) {
            const { type, data } = content.content.blocks[0];
            if (type == "header" && clean(data.text) == clean(content.data.title))
                content.content.blocks = content.content.blocks.slice(1);
        }

        // Merge images (if can)
        mergeImages(content.content.blocks);

        // Load all material images before complete loading
        ApplicationBuilder.waitForImages([
            ...content.content.blocks.filter(e => e.type == "image")
                .map(e => e.data.file.url as string),

            serverRoutesList.getFile(content.data.preview, false)
        ]).then(() => {
            setMaterial && setMaterial(content);
            setLoading && setLoading(false);
        });
    }, [ setMaterial, setLoading, setError ]);

    // Require material data from server
    React.useLayoutEffect(() => {
        setLoading && setLoading(true);
        setError && setError(undefined);
        const procedureStart = Date.now();

        fetch(makeRoute(serverRoutesList.getMaterial), new MakeFormData({
            [RequestOptions.getMaterial]: idx
        }).fetchObject).then(response => response.json()).then(response =>
            setTimeout(() => useMaterialContent(response), Date.now() - procedureStart > 200
                ? 0 : 200 - (Date.now() - procedureStart)));
    }, [ idx ]);

    return idx;
}

/**
 * Component for rendering materials from its sources
 * @constructor
 */
export default function MaterialRenderer (props: { strict?: boolean }) {
    const [ material, setMaterial ] = React.useState<ItemObject.FullMaterial>();
    const [ error, setError ] = React.useState<any>();
    const [ loading, setLoading ] = React.useState(true);

    const [ width, setWidth ] = React.useState<number>();

    const normalWidth = React.useRef<number>();

    React.useLayoutEffect(() => {
        const resizeHandler = () => normalWidth.current && setWidth(normalWidth.current);

        resizeHandler();
        window.addEventListener("resize", resizeHandler);
        return () => window.removeEventListener("resize", resizeHandler);
    }, []);

    const identifier = useMaterialData({ setMaterial, setError, setLoading });

    // If material not found or no identifier provided, show 404 page
    if (!identifier || (error && error == "no-material-file")) return <NotFoundPage />;

    return <PageFactory loader={ <Loading display={ !material || loading } error={ error } /> }
                        normalWidth={ normalWidth }>
        { material && <RawMaterialRenderer material={ material } strict={ props.strict }
                                           width={ width } /> }
    </PageFactory>;
}

interface RawMaterialRendererProps
{
    material: ItemObject.FullMaterial;

    homeButton?: false;
    titleBlock?: false;
    strict?: boolean;

    width?: number;
}

export function RawMaterialRenderer (props: RawMaterialRendererProps) {
    const context = React.useContext(ApplicationContext);
    const material = props.material;

    const contentBlockRef = React.useRef<HTMLDivElement | null>();

    return <>
        { material && <HelmetProvider>
            <Helmet>
                <meta content={ material.data.description } name="description" />

                <meta content="material" name="og:type" />
                <meta content={ material.data.title } name="og:title" />
                <meta content={ material.data.description } name="og:description" />

                <meta content={ material.data.preview } name="og:image" />
                <meta content={ material.data.title } name="og:image:alt" />

                <meta content={ material.data.title } name="twitter:title" />
                <meta content={ material.data.preview } name="twitter:image" />

                <meta content={ material.data.description } name="twitter:description" />

                <title>{ material.data.title }</title>
            </Helmet>
        </HelmetProvider> }
        <div className="material-container ui flex column gap-20"
             style={ props.width ? { width: props.width } : {} }>
            { props.titleBlock !== false && <TitleBlock material={ material.data } strict={ props.strict } /> }
            <div className={ classNames("content-block ui flex gap column", { strict: props.strict }) }
                 ref={ ref => contentBlockRef.current = ref }>
                <Blocks data={ material.content } renderers={ {
                    raw: RawHTMLRenderer,
                    table: TableRenderer,
                    attaches: FileRenderer,
                    warning: WarningRenderer,
                    header: HeaderRenderer,
                    carousel: CarouselRenderer
                } } />
            </div>

            <div className="extra-controls ui flex row gap wrap">
                { !props.strict && <ShareComponent sources={ { vk: true, facebook: true, twitter: true } }
                                                   title={ material.data.title }
                                                   current={ window.location.href } /> }

                { context.variablesData?.socialData && !props.strict &&
                    <SocialDataRenderer socialData={ context.variablesData.socialData.slice(1) } /> }
                { props.homeButton !== false &&
                    <Link to="/" className="ui clean"><Button icon="bi bi-house-fill">На главную</Button></Link> }
            </div>
        </div>
    </>;
}

/**
 * Component for rendering title block of material
 * @internal
 * @constructor
 */
function TitleBlock (props: { material: ItemObject.Material, strict?: boolean }) {
    return <div
        className="title-block ui">
        { !props.strict && <img src={ serverRoutesList.getFile(props.material.preview, false) }
                                alt={ props.material.title } className="preview-image ui border-radius-10" /> }

        <div className="title-block-content ui flex column gap">
            <span className="material-title ui fz-28 fw-700">{ props.material.title }</span>
            { !props.strict && <span className="material-date ui opacity-65">
                { convertDate(new Date(parseInt(props.material.datetime) * 1000)) }
            </span> }
            { !props.strict &&
                <ShareComponent sources={ { vk: true, facebook: true, twitter: true } } title={ props.material.title }
                                current={ window.location.href } /> }
        </div>
    </div>;
}
