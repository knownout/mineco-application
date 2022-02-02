/**
 * Module for file uploading.
 */
export default class Uploader {
    /**
     * @param config.config
     * @param {object} config
     * @param {Function} onUpload - callback for successful file upload
     * @param {Function} onError - callback for uploading errors
     * @param config.onUpload
     * @param config.onError
     */
    constructor({config, onUpload, onError}) {
        this.config = config;
        this.onUpload = onUpload;
        this.onError = onError;
    }

    /**
     * Handle clicks on the upload file button
     *
     * @fires ajax.transport()
     * @param {Function} onPreview - callback fired when preview is ready
     */
    async uploadSelectedFile({onPreview}) {
        /**
         * Custom uploading
         * or default uploading
         */

        if (this.config.uploader) {
            const response = await this.config.uploader();
            if (response) this.onUpload(response);
        }
    }
}

/**
 * Check if passed object is a Promise
 *
 * @param  {*}  object - object to check
 * @returns {boolean}
 */
function isPromise(object) {
    return object && typeof object.then === 'function';
}
