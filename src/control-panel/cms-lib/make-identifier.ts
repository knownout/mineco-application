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
