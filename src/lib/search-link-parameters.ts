/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

export default function searchLinkParameters (pathname: string) {
    const link = decodeURI(pathname).split("/")
        .map(e => e.trim()).filter(e => e.length > 0).slice(1);

    const responseObject: { tag?: string, page: number } = { page: 1 };
    if (link.length < 1) return responseObject;

    if (link.length == 2 && !isNaN(parseInt(link[1]))) {
        responseObject.tag = link[0];
        responseObject.page = parseInt(link[1]);

        return responseObject;
    }

    if (!isNaN(parseInt(link[0]))) responseObject.page = parseInt(link[0]);
    else responseObject.tag = link[0];

    return responseObject;
}
