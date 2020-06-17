# storeon-streams

Side effects management library for storeon

[![NPM version](https://img.shields.io/npm/v/@mariosant/storeon-streams.svg)](https://www.npmjs.com/package/@mariosant/storeon-streams)
![Test](https://github.com/mariosant/storeon-streams/workflows/Test/badge.svg)

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">

## Why?

Reactive functional programming (RFP) can help you write complex async scenarios in a beautiful way. 

You can easily write autosuggestion logic, optimistic operations and other complex async functionality without the mess.

This library can help you do that in a smooth, elegant, without having to restructure your current storeon modules. Most important, you **do not** have to ditch the nice async storeon's support!

## Install

There is a published package at npm for easy installation. Don't forget to add kefir too, as this library depends on it!

```bash
$ npm install @mariosant/storeon-streams kefir
```

### Quick example

Here's a side effect that triggers `time/tick` every second, ten times.

```javascript
import { interval } from "kefir";
import { fromStoreon } from "@mariosant/storeon-streams";

const time = (store) => {
  store.on("@init", () => ({}));
  store.on("time/tick", () => {
    const today = new Date();
    const currentTime =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    return { time: currentTime };
  });

  // yeap this is it.
  fromStoreon(store, () => interval(1000, ["time/tick"]).take(10));
};

export default time;
```

View a more advanced example that handles optimistic save on [Codesandbox](https://codesandbox.io/s/optimistic-stream-3xs5d?file=/src/articles.js).

## Usage

The module has a minimal api in the form of es exports.

### fromStoreon

`fromStoreon` is what you will be using for 90% of the time. It is responsible for connecting a kefir stream with your store.

```typescript
fromStoreon(store, ({changeStream, dispatchStream}) => Stream<[event, payload]>)
```

The plugin will emit actions, everytime the stream emits an event - so make sure the stream will emit only `[event, payload]` values.

`changeStream` is a kefir stream that emits when the store changes. This is using `@changed` event internally.

`dispatchStream` is a kefir stream that emits when an action is being dispatched. This is using `@dispatch` event internally.

Both of them are emitting the default values of storeon, wrapped in an array for easy destructuring.

### fromStoreonModule

Sometimes you want a storeon module that deals only with side effects. `fromStoreonModule` is a wrapper that does exactly that.

```javascript
const sideEffectsModule = fromStoreonModule(() => interval(1000, ["time/tick"]).take(10));

const store = createStoreon([moduleA, moduleB, sideEffectsModule]);
```

### isAction

When you are subscribing to dispatchStream, chances are you would like to subscribe to a specific one. `isAction` is a helper to do this quickly.

```javascript
import { fromStoreon, isAction } from "@mariosant/storeon-streams";

fromStoreon(store, ({ dispatchStream }) =>
  dispatchStream.filter(isAction("some/action"))
);
```

## Meta

Marios Antonoudiou – [@marios_ant](https://twitter.com/marios_ant) – mariosant@sent.com

Distributed under the MIT license.

[https://github.com/mariosant/storeon-streams](https://github.com/mariosant/storeon-streams)

## Contributing

1. Fork it (<https://github.com/mariosant/storeon-streams/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes using a semantic commit message.
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
