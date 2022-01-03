/**
 * List of keys for caching
 */
const cacheKeysList = {
    accountData: "accountData"
};

/**
 * Class for storing and processing json objects
 * in Storage-type object
 */
export default class CacheController {
    /**
     * Class for storing and processing json objects
     * in Storage-type object
     */
    constructor (public readonly storage: Storage) {}

    /**
     * Add-on over the Storage.getItem method that obtain a json string object
     * from the storage and parses it
     *
     * @param key storage key (cacheKeysList)
     */
    public getItem<T = any> (key: string): false | T {
        if (!this.itemExist(key)) return false;
        try {
            return JSON.parse(this.storage.getItem(key) as string);
        } catch { return false; }
    }

    /**
     * Add-on over the Storage.setItem method that stringifies value
     * and insert it to the storage
     *
     * @param key storage key (cacheKeysList)
     * @param value storage value
     */
    public setItem<T = any> (key: string, value: T) {
        this.storage.setItem(key, JSON.stringify(value));
        return this;
    }

    /**
     * Shortcut for the Storage.removeItem, can be replaced
     * with this.storage.removeItem
     *
     * @param key storage key
     */
    public removeItem (key: string) {
        this.storage.removeItem(key);
        return this;
    }

    /**
     * Check if item with specific key exist in the storage
     *
     * @param key storage key
     */
    public itemExist (key: string) { return Boolean(this.storage.getItem(key)); }
}

export { cacheKeysList };