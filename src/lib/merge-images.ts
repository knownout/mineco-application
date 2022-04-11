/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

import { Block } from "editorjs-blocks-react-renderer";

/**
 * Utility function for merging consecutive
 * images in editor js
 * @param blocks blocks container (object with address)
 */
export default function mergeImages (blocks: Block[]) {
    const sequences: [ number, number ][] = [];
    let seqStartIndex: number | null = null;

    blocks.forEach((block, index) => {
        if (block.type == "image") {
            if (seqStartIndex === null) seqStartIndex = index;
        } else {
            if (seqStartIndex !== null && index - seqStartIndex > 1)
                sequences.push([ seqStartIndex, index ]);

            seqStartIndex = null;
        }
    });

    if (seqStartIndex) sequences.push([ seqStartIndex, blocks.length ]);

    // data.file.url
    sequences.forEach(sequence => {
        const imageBlocksList = blocks.splice(sequence[0], sequence[1] - sequence[0]);
        const transformIdentifier = imageBlocksList[0].id;

        const filesList = imageBlocksList.map(block => block.data.file.url);
        blocks.push({
            id: transformIdentifier,
            type: "carousel",
            data: {
                files: filesList
            }
        });
    });
}
