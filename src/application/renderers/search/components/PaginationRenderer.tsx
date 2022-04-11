/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../common/pagination";

interface IPaginationRendererProps
{
    children: any;
    total: number;
    tag?: string;

    setPageRef: React.MutableRefObject<((page: number) => void) | undefined>;

    onPageChange? (): void;
}

export default function PaginationRenderer (props: IPaginationRendererProps) {
    const navigate = useNavigate();

    if (props.total <= 1) return <div className="ui flex row wrap w-100 pagination-page-content">
        { props.children }
    </div>;

    return <Pagination total={ props.total } splitBy={ 4 } topSwitches={ true } onPageChange={ page => {
        navigate("/" + [ "search", props.tag, page ].filter(e => e && String(e).length > 0).join("/"));
        props.onPageChange && props.onPageChange();
    } } setPageRef={ props.setPageRef }>
        { props.children }
    </Pagination>;
}
