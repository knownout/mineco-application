/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

/**
 * Function for converting javascript Date object
 * to the readable date
 *
 * @param date javascript Date object
 * @param time if false, time will not be rendered
 */
export default function convertDate (date: Date, time = true) {
    // get Date object properties in specific format
    const [ day, month, year, hours, minutes ] = [
        date.getDate(), date.getMonth(), date.getFullYear(),
        date.getHours().toString().padStart(2, "0"), date.getMinutes().toString().padStart(2, "0")
    ];

    // Localized month names
    const monthsNameList = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря"
    ];

    const dateString = `${ day } ${ monthsNameList[month] } ${ year } года`;
    const timeString = ` в ${ hours }:${ minutes }`;

    return (dateString + (time ? timeString : "")).trim();
}
