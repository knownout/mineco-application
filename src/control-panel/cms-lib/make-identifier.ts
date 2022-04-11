/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

/**
 * Function for creating material identifiers
 */
export default function makeIdentifier () {
    // Get charset from char codes range
    const charset = [
        ...Array(26).fill(String()).map((e, i) => String.fromCharCode(97 + i)),
        ...Array(10).fill(0).map((_, i) => i)
    ];

    let identifier = String();

    // Build identifier with specific (16) length
    while (identifier.length < 16) {
        const char = charset[Math.floor(Math.random() * charset.length)];
        if (identifier.slice(-1) == char) continue;

        identifier = identifier + char;
    }

    return identifier;
}
