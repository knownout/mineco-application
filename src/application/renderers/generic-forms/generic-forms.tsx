import React from "react";
import { useParams } from "react-router-dom";
import Button from "../../../common/button";
import Input, { InputMask } from "../../../common/input";
import commonMasks from "../../../common/input/common-masks";
import Loading from "../../../common/loading";
import Select from "../../../common/select";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
import classNames from "../../../lib/class-names";
import MakeFormData from "../../../lib/make-form-data";
import { makeRoute, serverRoutesList } from "../../../lib/routes-list";
import { Response, VariableOptions } from "../../../lib/types/requests";
import { RawMaterialRenderer, useMaterialData } from "../material/material";
import NotFoundPage from "../not-found";
import PageFactory from "../page-factory";
import "./generic-forms.scss";

interface FormConfiguration
{
    name: string;

    fields: {
        name: string;
        association: string;
        require?: boolean;
        mask?: string;
        limit?: number;
        icon?: string;
    }[];

    addresses: string[];
    textfield: {
        use: boolean;
        placeholder: string;

        limit: number;
    };
}

function verifyFormConfigurationObject (configuration: { [key: string]: any }) {
    const topLevelFields = [ "fields", "name", "textfield", "addresses", "target" ];

    if (topLevelFields.filter(key => key in configuration).length != topLevelFields.length)
        return false;

    if (!Array.isArray(configuration["fields"]) || typeof configuration["name"] !== "string")
        return false;

    if (!Array.isArray(configuration["addresses"])) return false;

    const textfieldFields = [ "use", "placeholder" ];
    if (textfieldFields.filter(key => key in configuration["textfield"]).length != textfieldFields.length)
        return false;

    return configuration["fields"].filter(field => ("name" in field) && ("association" in field)).length
        == configuration["fields"].length;


}

const inputValuesData: { [key: string]: string } = {};

type FormConfigurationsResponse = Response<ItemObject.Variable<string>[]>
export default React.memo(() => {
    const [ configuration, setConfiguration ] = React.useState<FormConfiguration>();
    const [ error, setError ] = React.useState(false);

    const [ formError, setFormError ] = React.useState<string | null>(null);

    const [ material, setMaterial ] = React.useState<ItemObject.FullMaterial>();
    const [ materialLoading, setMaterialLoading ] = React.useState(true);

    const [ textareaWords, setTextareaWords ] = React.useState(0);

    const [ formDone, setFormDone ] = React.useState(false);

    useMaterialData({ setMaterial, setLoading: setMaterialLoading });

    const keys = Object.values(useParams<string>());
    if (keys.length < 1) return <NotFoundPage />;

    const key = decodeURI(keys[0] as string);
    React.useLayoutEffect(() => {
        fetch(makeRoute(serverRoutesList.searchVariables), new MakeFormData({
            [VariableOptions.variableName]: "Настройки форм"
        }).fetchObject).then(response => response.json()).then((response: FormConfigurationsResponse) => {
            if (!response.responseContent)
                return setError(true);

            try {
                const configs = JSON.parse(response.responseContent[0].value) as { [key: string]: FormConfiguration };
                if (!(key in configs)) return setError(true);

                if (!verifyFormConfigurationObject(configs[key])) return setError(true);
                setConfiguration(configs[key]);
            } catch {
                return setError(true);
            }
        });
    }, [ key ]);

    if (error) return <NotFoundPage />;

    const getGenericFieldMask = (maskName?: string) => {
        if (!maskName) return undefined;

        switch (maskName) {
            case "name":
                return [ commonMasks.cleanSpaces, [ /[^А-яЁё. ]/g, "" ],
                    ...commonMasks.formatPunctuation ] as InputMask[];
            case "phone":
                return [ commonMasks.cleanSpaces, [ /[^0-9\-()]/g, "" ],
                    [ /(373)\s*/g, "+$1 " ],
                    [ /\s*[(]*(77[0-9]|55[2-7]|533|21[0-6])[)]*\s*/g, " ($1) " ],
                    [ /\)\s*([0-9])([0-9]{2})([0-9]{2})\s*/g, ") $1-$2-$3" ],
                    commonMasks.cleanSpaces
                ] as InputMask[];
            case "email":
                return [ commonMasks.cleanSpaces, [ /[^0-9._@\-A-z]/g, "" ] ] as InputMask[];
            case "address":
                return [ commonMasks.cleanSpaces, commonMasks.latinCyrillicWithSymbols, ...commonMasks.formatPunctuation ];
            default:
                return [ commonMasks.cleanSpaces ] as InputMask[];
        }
    };

    const textareaWordsLimiter = (event: React.FormEvent) => {
        const target = event.target as HTMLTextAreaElement;
        const value = target.value.trim().replace(/[^A-zА-яЁё ]/g, "").split(" ")
            .filter(e => e.length > 0);

        if (target.value.trim().length > 0)
            inputValuesData["text"] = target.value.trim();
        setTextareaWords(value.length);
    };

    const preventWordsExceed = (event: any) => {
        if (event.clipboardData && configuration) {
            const data = event.clipboardData.getData("Text") as string;
            if (textareaWords + data.split(" ").length > configuration.textfield.limit)
                event.preventDefault();

        } else if (configuration && textareaWords >= configuration.textfield.limit) event.preventDefault();
    };

    const sendMail = () => new Promise<void>((resolve, reject) => {
        if (formDone) return resolve();

        const phoneCheckRegex = /(\+373)*\s*\((77[0-9]|55[2-7]|533|21[0-6])\)\s([0-9])-([0-9]{2})-([0-9]{2})/g;
        const mailCheckRegex = /[A-z0-9.]{2,}@(yandex|bk|hk|outlook|yahoo|aol|msn|live|free|web|cox|((y|g|e|hot)mail)|mail).([cnrdbf](om|et|u|e|k|r|o.uk))/g;

        const inputState = inputValuesData;
        const checkValue = (fieldName: string) => {
            if (configuration && !inputState[fieldName] && !Object.entries(configuration.fields)
                .filter(e => e[1].association == fieldName).map(e => e[1].require)[0]) return true;

            switch (fieldName) {
                case "email":
                    return mailCheckRegex.test(inputState[fieldName]);
                case "phone":
                    return phoneCheckRegex.test(inputState[fieldName]);

                default:
                    return fieldName in inputState ? inputState[fieldName].length > 3 : false;
            }
        };

        const checkState = Object.keys(inputState).map(checkValue).reduce((a, b) => a && b);

        console.log("DBG1", inputState);
        if (!checkState || !configuration) return reject();

        const formData = new MakeFormData();
        Object.entries(inputState).forEach(([ key, value ]) => formData.add({ ["form:" + key]: value }));

        formData.add({ "form:sendTo": "sendTo" in inputState ? inputState["sendTo"] : configuration.addresses[0] });
        if (!("text" in inputValuesData)) return reject();

        console.log("DBG2", inputState);
        formData.add({ "form:text": inputState["text"] });

        console.log(inputState);
        fetch(makeRoute(serverRoutesList.sendMail), formData.fetchObject).then(response => response.json())
            .then((response: Response) => {
                console.log(response);
                if (!response.success) return setFormError("Не удалось отправить форму, повторите попытку позже");
                setFormError(null);
                setFormDone(true);

                setTimeout(() => {
                    window.location.href = "/";
                }, 3000);
            }).catch(() => setFormError("Не удалось отправить форму, повторите попытку позже"))
            .finally(resolve);
    });

    return <PageFactory loader={ <Loading display={ !configuration || materialLoading } /> }>
        { configuration && <div className={ classNames("generic-form ui flex column", { disabled: formDone }) }>
            <span className="form-title ui fz-20 fw-700 opacity-75 upper">{ configuration.name }</span>
            { material && <RawMaterialRenderer material={ material } /> }
            <div className="form-data-wrapper ui flex column">
                { configuration.fields.map(field => {
                    return <Input placeholder={ (field.require ? "*" : "") + field.name }
                                  mask={ getGenericFieldMask(field.mask) } maxLength={ field.limit }
                                  key={ field.name + Math.random() } icon={ field.icon }
                                  onInput={ value => inputValuesData[field.association] = value }>
                        { inputValuesData[field.association] }
                    </Input>;
                }) }

                <span className="ui opacity-50 margin-5">* - обязательные для заполнения поля</span>
            </div>

            <span className="ui opacity-50 form-sub-title fw-700 fz-14">Выберите получателя</span>
            { configuration.addresses.length > 1 &&
                <Select items={ configuration.addresses }
                        onItemSelect={ (index, name) => inputValuesData["sendTo"] = name } /> }

            { configuration.textfield.use && <>
                <span className="ui opacity-50 form-sub-title fw-700 fz-14">Текст сообщения</span>
                <span className="textarea-hint-label ui fz-14 opacity-50">
                    Введено { textareaWords } слов из { configuration.textfield.limit }
                </span>
                <textarea className="ui textarea" placeholder={ configuration.textfield.placeholder }
                          onKeyPress={ preventWordsExceed } onPaste={ preventWordsExceed }
                          onInput={ textareaWordsLimiter } maxLength={ configuration.textfield.limit * 15 } />
            </> }
            { formError && <span className="form-error ui opacity-65">Форма не отправлена: { formError }</span> }
            { formDone &&
                <span className="form-done ui opacity-65">
                    Форма успешно отправлена, можно закрыть эту страницу.
                    Через 3 секунды вы будете перенаправлены на главную страницу
                </span> }
            <Button className="ui margin-5 optimize w-fit" onAsyncClick={ sendMail }
                    onAsyncException={ () => setFormError("Форма заполнена неверно, проверьте " +
                        "обязательные для ввода поля и повторите попытку") }>Отправить</Button>
        </div> }
    </PageFactory>;
});
