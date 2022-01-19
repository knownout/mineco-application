/**
 * Class for creating FormData objects with chaining ability and
 * objects support
 */
export default class MakeFormData {
    /**
     * Native FormData object
     */
    public readonly formData = new FormData();

    /**
     * Class for creating FormData objects with chaining ability and
     * objects support
     *
     * @param items items list to be applied to the FormData
     */
    constructor (items?: { [key: string]: any }) { if (items) this.add(items); }

    /**
     * Get native FormData object as object suitable for the fetch function
     */
    public get fetchObject () { return { method: "POST", body: this.formData }; }

    /**
     * An add-on over the native method for adding a FormData object, allows
     * simultaneous application of several elements
     *
     * @param items items list to be applied
     */
    public add (items: { [key: string]: any }) {
        Object.entries(items).forEach(([ key, value ]) => {
            if (!value || typeof value === "string" && value.trim().length == 0)
                return;

            if (value instanceof File) this.formData.append(key, value);
            else this.formData.set(key, String(value));
        });

        return this;
    }

    /**
     * An add-on over the native remove method of the FormData object allows
     * deleting multiple items at the same time
     * @param items
     */
    public remove (...items: string[]) {
        items.forEach(item => { if (this.formData.has(item)) this.formData.delete(item); });
        return this;
    }
}