/**
 * Function for limiting text by words count
 * @param text string that should be limited
 * @param limit max words count (default - 10)
 */
export function setWordsLimit (text: string, limit: number = 10) {
    // Array of all words of the description (not sliced)
    const descriptionWordsArray = text.split(" ").map(e => e.trim())
        .filter(e => e.replace(/[^A-zА-я]/g, "").length > 0);

    // Description string form the sliced descriptionWordsArray
    let descriptionString = descriptionWordsArray.slice(0, limit)
        .join(" ").trim();

    // Add dots to the end of string if limit exceeded
    if (limit < descriptionWordsArray.length) descriptionString += "...";

    // Remove extra dots at the end of the description string
    if (descriptionString.slice(-4) == "....") descriptionString = descriptionString
        .slice(0, descriptionString.length - 1);

    if (descriptionString.slice(-4) == ",...") descriptionString = descriptionString
        .slice(0, descriptionString.length - 4) + "...";

    return descriptionString;
}