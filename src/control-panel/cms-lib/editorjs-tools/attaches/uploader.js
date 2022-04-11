/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

/**
 * Module for file uploading.
 */
export default class Uploader
{
    /**
     * @param config.config
     * @param {object} config
     * @param {Function} onUpload - callback for successful file upload
     * @param {Function} onError - callback for uploading errors
     * @param config.onUpload
     * @param config.onError
     */
    constructor ({ config, onUpload, onError }) {
        this.config = config;
        this.onUpload = onUpload;
        this.onError = onError;
    }

    /**
     * Handle clicks on the upload file button
     */
    async uploadSelectedFile () {
        /**
         * Custom uploading
         * or default uploading
         */

        if (this.config.uploader) {
            // noinspection JSValidateTypes
            const response = await this.config.uploader();
            if (response) this.onUpload(response);
        }
    }
}
