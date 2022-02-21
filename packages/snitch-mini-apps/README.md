# Счетчик для платформы MiniApps

## Установка

Добавить в разметку index.html:

1. код библиотеки [**@mrgis/snitch-mini-apps**](https://unpkg.com/@mrgis/snitch-mini-apps@latest/dist/iife.min.js);
2. инициализацию счетчика: `window.snitch = createSnitch(...)`.

Например:

```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      // код @mrgis/snitch-mini-apps (https://unpkg.com/@mrgis/snitch-mini-apps@latest/dist/iife.min.js)
    </script>
    <script>
      // инициализация счетчика snitch:
      window.snitch = createSnitch({
        initialScreen: { screenType: 'loading' }
      })
    </script>
    <!-- ... -->
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

> ⚠️ Важно подключать код библиотеки непосредственно в код страницы (_inline_) перед кодом приложения. Можно скопировать и вставить код в разметку вручную отсюда [https://unpkg.com/@mrgis/snitch-mini-apps@latest/dist/iife.min.js](https://unpkg.com/@mrgis/snitch-mini-apps@latest/dist/iife.min.js) или организовать вставку на этапе сборки проекта, например с помощью webpack-плагина [InlineChunkHtmlPlugin](https://github.com/facebook/create-react-app/tree/main/packages/react-dev-utils#new-inlinechunkhtmlpluginhtmlwebpackplugin-htmlwebpackplugin-tests-regex)

### TypeScript

Для использования `snitch` через TypeScript вам понадобится декларировать типы:

```TypeScript
type SnitchEventPayload = {
  [key: string]: string | number
}

type Snitch = (eventName: string, eventPayload?: SnitchEventPayload) => void

declare global {
  interface Window {
    snitch: Snitch
  }
}
```

## Трекинг событий

Функция `snitch` имеет сигнатуру `(eventName: string, eventPayload?: { [key: string]: string | number }) => void`. Для трекинга события необходимо вызвать функцию `snitch` передав имя события и опциональные параметры, например:

```js
snitch('startPlayingButtonPress') // пользователь нажал на кнопку «Начать игру»
snitch('characterLevelUp', { characterId: '123', level: 12 }) // пользователь прокачал персонажа с id '123' до 12 уровня
```

## Трекинг навигации пользователя по экранам приложения

Чтобы собирать статистику о навигации пользователя внутри приложения вводится понятие экрана. Экран приложения описывается объектом с полем `screenType` и опциональным полем `screenId`, например: `{ screenType: 'onboarding', screenId: 'step1' }`

- `screenType`: _string_ — указывает на тип экрана, например: `'сatalogue'`, `'product'`, `'cart'`.
- `screenId`: _string_ — позволяет, когда это требуется, уточнить информацию об экране. Например, экран со статьей «Как есть печенье и не толстеть?» `screenType` может иметь значение `'article'`, а `screenId` значение `'how-to-eat-cokies-and-not-get-fat'` — уникальный slug статьи.

<p align="center">
  <img width="880" src="https://staticmail.hb.bizmrg.com/screens-example.jpg" />
</p>

<p align="center">
Пример разметки экранов приложения
</p>

#### Чтобы настроить трекинг навигации, необходимо:

1. В коде инициализации счетчика указать экран, на который попадает пользователь при открытии приложения:

```js
window.snitch = createSnitch({
  initialScreen: { screenType: 'loading' } // <- экран загрузки
})
```

2. При показах пользователю нового экрана необходимо отправлять событие `screenChange` с информацией об экране в качестве параметров события, например:

```js
snitch('screenChange', { screenType: 'catalogue' }) // пользователь перешел на экран каталога
snitch('screenChange', { screenType: 'product', screenId: 'wagon-wheels-cookies' }) // пользователь перешел на экран продукта «Печенье Wagon Wheels»
snitch('screenChange', { screenType: 'cart' }) // пользователь перешел в корзину
```
