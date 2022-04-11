/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import CacheController from "./cache-controller";

export default class ScrollController
{
    private readonly cacheController = new CacheController(sessionStorage);
    private entriesList: { [key: string]: number }[];
    private scrollSaveTimeout: any = null;

    constructor () {
        this.entriesList = this.cacheController.getItem < typeof this.entriesList > ("scrollState") || [];
    }

    public get scrollState () {
        const path = window.location.pathname;
        const result = this.entriesList.filter(e => Object.keys(e)[0] == path);
        const response = result && result.length > 0 && Object.values(result[0])[0];

        if (result.length > 0 && response) return response > 0 ? response : false;
        else return false;
    }

    public saveScrollState (position: number) {
        const path = window.location.pathname;
        const entries = this.entriesList.filter(e => Object.keys(e)[0] != path).slice(-1);

        entries.push({ [path]: position });
        this.entriesList = entries;

        if (this.scrollSaveTimeout) clearTimeout(this.scrollSaveTimeout);
        this.scrollSaveTimeout = setTimeout(() => {
            this.cacheController.setItem("scrollState", this.entriesList);
        }, 100);
    }
}
