/**
 * A function to create class names from any type of element.
 *
 * If an object is supplied, only class names (keys) with
 * true value will be applied
 *
 * @param rawClassNames items list
 */
export default function classNames (...rawClassNames: any[]) {
    const classNamesList: string[] = [];

    // Iterate through items list
    rawClassNames.forEach(rawClassName => {
        if (typeof rawClassName === "object") {
            // If item is array, just apply its items to class names list
            if (Array.isArray(rawClassName)) rawClassName.forEach(className => Boolean(className)
                && classNamesList.push(String(className)
                    .trim()));

            // Check key values
            else Object.entries(rawClassName).forEach(([ key, value ]) => {
                if (Boolean(value)) classNamesList.push(String(key).trim());
            });
        } else Boolean(rawClassName) && classNamesList.push(String(rawClassName).trim());
    });

    // Format and return class names list as string
    return classNamesList.map(e => e.trim()).filter(e => e.length > 0).join(" ").trim();
}