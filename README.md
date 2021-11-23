# Web application for the Ministry of A&NR of Transnistria
<img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/re-knownout/mineco-application"> <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/re-knownout/mineco-application"> <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/re-knownout/mineco-application"> <img alt="GitHub" src="https://img.shields.io/github/license/re-knownout/mineco-application">

> Contents of this file will not be translated 
into other languages (including English) due to the 
fact that this project is local and does not 
provide for international use

This project created and developed as part of the 
program to update the web infrastructure of my current 
place of work (Ministry of Agriculture and Natural 
Resources of Transnistria)

_All components of this project that do not use internal 
dependencies will be published after the completion 
of this application_

## Веб-приложение Министерства сельского хозяйства и природных ресурсов Приднестровья

Данное веб-приложение разработано в рамках проекта
по обновлению веб-инфраструктуры моего текущего места работы
(МСХиПР)

_Приложение создано на базе фреймворка `React 17`, для сборки используется
webpack 4 в связи с тем, что webpack пятой версии (или ts-loader для пятой 
версии вебпака) не может адекватно работать с прямым экспортом
пространств имен_

Все данные видимой обычным пользователям части приложения
представлены в виде материалов

### 📰 Концепция материалов
> Изначально я планировал разбивать данные по группам _(новости, страницы,
документы)_, однако такой подход не был в достаточной степени эффективным.
Таким образом, я пришел к концепции материалов, где _любая*_ информация
на сайте (см. исключения) представлена в виде материала

Сам материал представляет собой JSON файл (сгенерированный
редактором системы управления контентом), содержащий в себе данные
о дате публикации материала (дата может быть изменена как в меньшую
сторону от текущей, так и в большую) и, собственно, содержимое (набор
блоков)

_Исключением из данной концепции являются, как я их назвал, `properties`.
Данные типа `properties` представляют собой ключи в специально
отведенной под это дело таблице базы данных, значениями которых являются
те или иные данные не очень большого размера_

_На данный момент, `properties` использует только блок "Важная информация".
Сделано это для того, чтобы: во-первых, не перегружать главную страницу
сайта еще одним подгружаемым материалом, во-вторых, блок "Важная информация"
не поддерживает никакие блоки, кроме параграфов со ссылками и/или
стилизованным текстом, по сему, для этого и подобного ему блоков
было создано отдельное хранилище данных (таблица в БД) и задана отдельная
конфигурация редактора (без поддержки блоков и с ограниченным набором
инструментов стилизации текста)_

### 🧰 Компоненты приложения
Для данного приложения разработаны и/или находятся в разработке ряд
компонентов, ниже приведен список некоторых из них:

| Компонент | Краткое описание |
| --- | ------ |
| `PageWrapper` | Компонент для создания адаптивной страницы, которая автоматически центрирует своё содержимое относительно размеров родителя. Компонент позволяет выполнять асинхронные запросы во время загрузки страницы  |
| `Group` | Компонент для создания стилизованных групп объектов, никакой программной нагрузки в себе не несет, однако позволяет красивенько группировать объекты на странице |
| `TextInput` | Поле для ввода текста с поддержкой заполнителя (без обновления состояния при вводе) |
| `Button` | Компонент кнопки с поддержкой выполнения асинхронных запросов во время анимации загрузки (та же анимация, что и у `PageWrapper`, но без текста) |

Выше представлены только те компоненты, которые 
не используют внутренние зависимости. Ссылки на репозитории компонентов
будут добавляться по мере публикации компонентов
 
_В данный момент все из
компонентов используют внутренние зависимости в виде функций
`createBootstrapIcon`, `classNames` и других, однако эти функции
могут быть лего объединены с компонентом, что и будет сделано в
"публичных" версиях данных компонентов)_

https://ecology-pmr.org/ - Министерство сельского хозяйства и природных
ресурсов Приднстровья<br>
re-knownout - https://github.com/re-knownout/
<br>knownout@hotmail.com
