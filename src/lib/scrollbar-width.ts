/**
 * Function for calculating scrollbar width
 *
 * @link https://stackoverflow.com/a/13382873
 */
export default function getScrollbarWidth () {
    // Creating invisible container
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll"; // forcing scrollbar to appear

    if ("msOverflowStyle" in outer.style)
        outer.style["msOverflowStyle" as any] = "scrollbar"; // needed for WinJS apps

    if (!document.body) return 0;
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement("div");
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    if (outer.parentNode) outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}