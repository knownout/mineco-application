/**
 * Function for processing class names from strings and objects
 *
 * Objects are a key-value pair, if the value is an expression and is true,
 * the key will be added as the class name.
 *
 * All undefined values will be skipped
 *
 * @param classNames string, object or undefined
 */
export function classNames (...classNames: (undefined | string | { [key: string]: boolean })[])
{
    const resultingClassNames: string[] = [];

    for (const className of classNames)
    {
        // If item is undefined, skip it
        if(!className) continue;

        // Process item as string or object
        if (typeof className === "string")
        {
            // ... if string, just push to array
            resultingClassNames.push(className);
        } else
        {
            // ... otherwise check the expressions and based on the
            // result add the keys to the resulting array
            Object.keys(className).forEach(key => {
                if (className[key]) resultingClassNames.push(key);
            });
        }
    }

    return resultingClassNames.filter(e => e.length > 0).join(" ").trim();
}