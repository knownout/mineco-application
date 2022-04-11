/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import React from "react";
import classNames from "../../lib/class-names";
import "./pagination.scss";

interface PaginationProps
{
    total: number;
    splitBy: number;

    defaultPage?: number;

    children: any;

    topSwitches?: boolean;
    setPageRef: React.MutableRefObject<((page: number) => void) | undefined>;

    onPageChange? (page: number): void;
}

export default function Pagination (props: PaginationProps) {
    const [ page, setPage ] = React.useState(props.defaultPage ? props.defaultPage : 1);

    const total = Array(props.total).fill(0).map((e, i) => String(i + 1));
    if (props.setPageRef) props.setPageRef.current = setPage;

    let before = total.slice(0, props.splitBy);
    let after = total.slice(-props.splitBy + 1);

    let middle: string[] = [];
    if (page >= props.splitBy) {
        let beforeOffset = page - (props.splitBy - 1) + 1;
        beforeOffset = beforeOffset > 3 ? 3 : beforeOffset;

        before = total.slice(0, beforeOffset - 1);
        middle = total.slice(page - 2, page + 1);
        after = total.slice(-props.splitBy + (3 - (3 - beforeOffset)));
        if (page - 1 >= props.total - props.splitBy) {
            after = [];

            let middleOffset = page - 2;
            if (props.total - middleOffset < props.splitBy + 1)
                middleOffset = props.total - (props.splitBy + 1);

            middle = total.slice(middleOffset, props.total);
        }
    }

    if (props.total < props.splitBy) after = [];

    const pageSwitchesList = [
        ...before,
        ...(middle.length > 0 ? [ "..." ] : []),
        ...middle,
        ...(after.length > 0 ? [ "..." ] : []),
        ...after
    ];

    const switches = <div className="pagination-switch-buttons ui flex row center-jc w-fit wrap">
        { pageSwitchesList.map((item, index) => {
            if (item == "...") return <span className="page-switch-placeholder" key={ index * Math.random() }>
                    ...
                </span>;

            const pageIndex = parseInt(item as string);
            return <div className={ classNames("page-switch", { select: pageIndex == page }) }
                        key={ pageIndex }
                        onClick={ () => {
                            setPage(pageIndex);
                            props.onPageChange && props.onPageChange(pageIndex);
                        } }>
                { item }
            </div>;
        }) }
    </div>;

    return <div className="pagination-component w-fit ui flex column center-ai">
        { props.topSwitches && switches }
        <div className="pagination-page-content ui flex column w-100">
            { props.children }
        </div>
        { switches }
    </div>;
}
