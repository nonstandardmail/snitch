# Счетчик для платформы MiniApps

## Установка

Добавить в разметку index.html:

1. код библиотеки [**@vkontakte/vk-bridge**](https://unpkg.com/@vkontakte/vk-bridge@latest/dist/browser.min.js);
2. код библиотеки [**@mrgis/snitch-mini-apps**](https://unpkg.com/@mrgis/snitch-mini-apps@latest/dist/iife.min.js);
3. инициализацию счетчика snitch: `window.snitch = createSnitch(...)`.

Например:

```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      // код @vkontakte/vk-bridge (https://unpkg.com/@vkontakte/vk-bridge@latest/dist/browser.min.js)
    </script>
    <script>
      // код @mrgis/snitch-mini-apps (https://unpkg.com/@mrgis/snitch-mini-apps@latest/dist/iife.min.js)
    </script>
    <script>
      // инициализация счетчика snitch:
      window.snitch = createSnitch({
        vkBridge: window.vkBridge,
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

> ⚠️ Важно подключать код библиотек непосредственно в код страницы (_inline_) перед кодом приложения. Можно скопировать код в разметку вручную, но удобнее всего организовать это на этапе сборки проекта, например с помощью webpack-плагина [InlineChunkHtmlPlugin](https://github.com/facebook/create-react-app/tree/main/packages/react-dev-utils#new-inlinechunkhtmlpluginhtmlwebpackplugin-htmlwebpackplugin-tests-regex)

> ⚠️ Если ранее вы подключали `@vkontakte/vk-bridge` в бандл приложения в качестве npm зависимости, то следует убрать из кода приложения все соответствующие импорты и использовать vkBridge доступный через глобальную переменную: `window.vkBridge`.

### TypeScript

Для использования глобальных переменных `snitch` и `vkBridge` через TypeScript вам понадобится декларировать их типы, например:

```TypeScript
import { VKBridge } from '@vkontakte/vk-bridge/dist/types/src/types/bridge'

type SnitchEventPayload = {
  [key: string]: string | number
}

type Snitch = (eventName: string, eventPayload?: SnitchEventPayload) => void

declare global {
  interface Window {
    vkBridge: VKBridge,
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

![](https://staticmail.hb.bizmrg.com/screens-example.jpg)

##### Пример разметки экранов приложения:

</p>

#### Чтобы настроить трекинг навигации, необходимо:

1. В коде инициализации счетчика указать экран, на который попадает пользователь при открытии приложения:

```js
window.snitch = createSnitch({
  vkBridge: window.vkBridge,
  initialScreen: { screenType: 'loading' } // <- экран загрузки
})
```

2. При показах пользователю нового экрана необходимо отправлять событие `screenChange` с информацией об экране в качестве параметров события, например:

```js
snitch('screenChange', { screenType: 'catalogue' }) // пользователь перешел на экран каталога
snitch('screenChange', { screenType: 'product', screenId: 'wagon-wheels-cookies' }) // пользователь перешел на экран продукта «Печенье Wagon Wheels»
snitch('screenChange', { screenType: 'cart' }) // пользователь перешел в корзину
```
