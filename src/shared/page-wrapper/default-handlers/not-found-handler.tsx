import React from "react";
import Group from "../../group-component/group-component";

/**
 * Not found exception handler of the PageWrapper component
 *
 * @author re-knownout "knownOut" knownout@hotmail.com
 * @version 1.0.0
 */
export default function NotFoundHandler ()
{
    return <div className="not-found-handler handler">
        <span className="handler-title">Станица не найдена</span>

        <Group title="Что делать?" className="recommendation semi-transparent">
            Данная страница удалена или не существует. Если Вы уверены, что это ошибка, сообщите администратору
        </Group>
    </div>;
}
