/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

/**
 * Class for creating search masks in the input fields
 */
export default class InlineSearch
{
    constructor (private readonly searchQuery: string) {
    }

    /**
     * Get special requests from the main search
     * query string and return them as object
     */
    public getEntriesList (options: { [key: string]: [ RegExp, string ] }) {
        const entries: { [key: string]: string[] } = {};
        let searchQuery = this.searchQuery;

        Object.entries(options).forEach(([ key, [ regexp, symbol ] ]) => {
            const matches: string[] = [];

            function matcher (match: string) {
                matches.push(match);
                return "";
            }

            searchQuery = searchQuery.replace(regexp, matcher).trim();
            entries[key] = matches.map(e => e.trim().replace(symbol, ""))
                .filter(e => e.length > 0);
        });

        return { searchQuery, entries };
    }

}
