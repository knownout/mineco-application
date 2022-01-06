export default function convertDate (date: Date, time = true) {
    const [ day, month, year, hours, minutes ] = [
        date.getDate(), date.getMonth(), date.getFullYear(),
        date.getHours().toString().padStart(2, "0"), date.getMinutes().toString().padStart(2, "0")
    ];

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