import React from "react";
import { useParams } from "react-router-dom";
import Button from "../../../common/button";
import Input, { InputMask } from "../../../common/input";
import commonMasks from "../../../common/input/common-masks";
import Loading from "../../../common/loading";
import Select from "../../../common/select";
import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";
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
    const topLevelFields = [ "fields", "name", "textfield", "addresses" ];

    if (topLevelFields.filter(key => key in configuration).length != topLevelFields.length)
        return false;

    if (!Array.isArray(configuration["fields"]) || typeof configuration["name"] !== "string")
        return false;

    if (!Array.isArray(configuration["addresses"])) return false;

    const textfieldFields = [ "use", "placeholder" ];
    if (textfieldFields.filter(key => key in configuration["textfield"]).length != textfieldFields.length)
        return false;

    return configuration["fields"].filter(field => "name" in field).length == configuration["fields"].length;


}

type FormConfigurationsResponse = Response<ItemObject.Variable<string>[]>
export default React.memo(() => {
    const [ configuration, setConfiguration ] = React.useState<FormConfiguration>();
    const [ error, setError ] = React.useState(false);

    const [ material, setMaterial ] = React.useState<ItemObject.FullMaterial>();
    const [ materialLoading, setMaterialLoading ] = React.useState(true);

    const [ textareaWords, setTextareaWords ] = React.useState(0);

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
                return [ commonMasks.cleanSpaces, [ /[^A-яЁё. ]/g, "" ],
                    ...commonMasks.formatPunctuation ] as InputMask[];
            case "phone":
                return [ commonMasks.cleanSpaces, [ /[^0-9\-()]/g, "" ] ] as InputMask[];
            case "email":
                return [ commonMasks.cleanSpaces, [ /[^0-9._@\-A-z]/g, "" ] ] as InputMask[];
            default:
                return [ commonMasks.cleanSpaces ] as InputMask[];
        }
    };

    const textareaWordsLimiter = (event: React.FormEvent) => {
        const target = event.target as HTMLTextAreaElement;
        const value = target.value.trim().replace(/[^A-zА-яЁё ]/g, "").split(" ")
            .filter(e => e.length > 0);

        setTextareaWords(value.length);
    };

    const preventWordsExceed = (event: any) => {
        if (event.clipboardData && configuration) {
            const data = event.clipboardData.getData("Text") as string;
            if (textareaWords + data.split(" ").length > configuration.textfield.limit)
                event.preventDefault();

        } else if (configuration && textareaWords >= configuration.textfield.limit) event.preventDefault();
    };

    return <PageFactory loader={ <Loading display={ !configuration || materialLoading } /> }>
        { configuration && <div className="generic-form ui flex column">
            <span className="form-title ui fz-20 fw-700 opacity-75 upper">{ configuration.name }</span>
            { material && <RawMaterialRenderer material={ material } /> }
            <div className="form-data-wrapper ui flex column">
                { configuration.fields.map(field => {
                    return <Input placeholder={ (field.require ? "*" : "") + field.name }
                                  mask={ getGenericFieldMask(field.name) }
                                  key={ field.name + Math.random() } icon={ field.icon } />;
                }) }

                <span className="ui opacity-50 margin-5">* - обязательные для заполнения поля</span>
            </div>

            <span className="ui opacity-50 form-sub-title fw-700 fz-14">Выберите получателя</span>
            { configuration.addresses.length > 1 &&
                <Select items={ configuration.addresses } /> }

            { configuration.textfield.use && <>
                <span className="ui opacity-50 form-sub-title fw-700 fz-14">Текст сообщения</span>
                <span className="textarea-hint-label ui fz-14 opacity-50">
                    Введено { textareaWords } слов из { configuration.textfield.limit }
                </span>
                <textarea className="ui textarea" placeholder={ configuration.textfield.placeholder }
                          onKeyPress={ preventWordsExceed } onPaste={ preventWordsExceed }
                          onInput={ textareaWordsLimiter } maxLength={ configuration.textfield.limit * 15 } />
            </> }
            <Button className="ui margin-5 optimize w-fit">Отправить</Button>
        </div> }
    </PageFactory>;
});
