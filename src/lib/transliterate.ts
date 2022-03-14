export default function transliterate (text: string) {
    let mappings = {
        "A": "A",
        "Б": "B",
        "В": "V",
        "Г": "G",
        "Д": "D",
        "Е": "E",
        "Ж": "ZH",
        "З": "Z",
        "И": "I",
        "Й": "J",
        "К": "K",
        "Л": "L",
        "М": "M",
        "Н": "N",
        "О": "O",
        "П": "P",
        "Р": "R",
        "С": "S",
        "Т": "T",
        "У": "Y",
        "Ф": "F",
        "Х": "H",
        "Ц": "TS",
        "Ч": "CH",
        "Ш": "SH",
        "Щ": "SCH",
        "Ы": "Y",
        "Э": "E",
        "Ю": "YU",
        "Я": "YA"
    };

    let response = text.replace(/[ъь]/g, "");
    Object.entries(mappings).forEach(([ key, value ]) => response = response
        .replace(RegExp(key.toLocaleLowerCase(), "g"), value.toLocaleLowerCase())
        .replace(RegExp(key, "g"), value));

    return response;
}
