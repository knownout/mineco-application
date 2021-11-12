/**
 * Cache any content as json string to specific browser storage (session on local)
 */
export default class CacheController
{
    private localCacheStorage = window.sessionStorage;

    constructor (storage?: Storage) { if (storage) this.localCacheStorage = storage; }

    /**
     * Add content to specific browser storage as json string
     * @param key content number (LocalCacheKeys item) in storage
     * @param content content to be added to storage
     *
     * @return CacheController instance
     */
    public cacheContent (key: CacheKeys, content: any)
    {
        this.localCacheStorage.setItem(key.toString(), JSON.stringify(content));
        return this;
    }

    /**
     * Load content from specific browser storage and parse
     * @param key content number (LocalCacheKeys item) in storage
     */
    public fromCache<T = object> (key: CacheKeys): T | null
    {
        const cache = this.localCacheStorage.getItem(key.toString());

        if (!cache) return null;
        return JSON.parse(cache) as T;
    }

    /**
     * Remove entry from specific browser storage
     * @param key CacheKeys key
     *
     * @return CacheController instance
     */
    public removeCachedContent (key: CacheKeys)
    {
        this.localCacheStorage.removeItem(key.toString());
        return this;
    }

    /**
     * Set storage for current class instance
     * @param storage object of global type Storage
     */
    public set cacheStorage (storage: Storage)
    {
        this.localCacheStorage = storage;
    }
}

export enum CacheKeys
{
    loadedMaterialsList,
    accountData,
    cmsMenuRouterPage
}
