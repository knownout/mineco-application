import React from "react";
import Group from "../../group-component/group-component";

/**
 * Default exception handler of the PageWrapper component
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function DefaultExceptionHandler (props: { error: Error }) {
    return (
        <div className="default-exception-handler">
            <span className="handler-title">Произошла ошибка { props.error.name }</span>

            <Group title="Что делать?" className="recommendation semi-transparent">
                Попробуйте перезагрузить страницу, браузер или подождать некоторое время. Если ошибка не
                исчезла, обратитесь к администратору
            </Group>

            <Group title="Что произошло?" className="recommendation semi-transparent">
                <code>{ props.error.message }</code>
            </Group>
        </div>
    );
}