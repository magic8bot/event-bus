# EventBus

A generic multi-level event emitter with granular control over event emitting level.

## Install

`yarn add @magic8bot/event-bus`

or

`npm i @magic8bot/event-bus`

## API

| Method         | Return       | Example                                                      |
| -------------- | ------------ | ------------------------------------------------------------ |
| `new EventBus` | `EventBus`   | `const eventBus = new EventBus()`                            |
| `get`          | `EventBus`   | `eventBus.get('eventName')`                                  |
|                |              | `eventBus.get('eventName')('foo')`                           |
|                |              | `eventBus.get('eventName')('foo')('bar')`                    |
| `emit`         | `void`       | `eventBus.emit(data)`                                        |
|                |              | `eventBus.get('eventName').emit(data)`                       |
|                |              | `eventBus.get('eventName')('foo').emit(data)`                |
| `listen`       | `unlisten()` | `eventBus.listen(listenerFn)`                                |
|                |              | `eventBus.get('eventName').listen(listenerFn)`               |
|                |              | `eventBus.get('eventName')('foo').listen(listenerFn)`        |
|                |              | `eventBus.get('eventName')('foo')('bar').listen(listenerFn)` |

## Methods explained

### `new EventBus`
Creates a new `root` event bus node.

### `eventBus.get(string)`
Returns a new child node `EventBus`.
 - Can be curried infinitely.

### `eventBus.emit(any)`
 Will `emit` an event to it's `level` and all descendant nodes.

### `eventBus.listen((any) => void)`
 Will `listen` to events on it's `level` and all ancestors leading to `root`.\
 The return value is an `unlisten` function. When invoked, it will stop this\
 listener from receiving any more events.

## Examples

### Basic

The most basic single level event bus.

```typescript
import {} from '@magic8bot/event-bus'

const eventBus = new EventBus()

const emitter = eventBus.emit
const listener = eventBus.listen

listener((data) => {
  // ...Do something with data
})

listener((data) => {
  // ...Do something else with data
})

emitter({ foo: 'bar' })
emitter({ fizz: 'bang' })
```

### 2 level event bus (terse syntax)

A dual level tiered event bus.

- All `root` level events will bubble up.
- Events can be granular and be sent only into a specific level.

```typescript
import {} from '@magic8bot/event-bus'

const eventBus = new EventBus()

const emitter = eventBus.emit
const listener = eventBus.listen

const eventBusL2 = eventBus.get('L2')
const emitterL2 = eventBusL2.emit
const listenerL2 = eventBusL2.listen

// Will onlt get events from `emitter`
listener((data) => {
  // ...Do something with data
})

// Will get events from `emitter` and `emitter -> emitterL2`
listenerL2((data) => {
  // ...Do something else with data
})

emitter({ foo: 'bar' })
emitterL2({ fizz: 'bang' })
```

### 2 level event bus (alternate syntax)

```typescript
import {} from '@magic8bot/event-bus'

const eventBus = new EventBus()

// Will onlt get events from `eventBus`
eventBus.listen((data) => {
  // ...Do something with data
})

// Will get events from `eventBus` and `eventBus -> L2`
eventBus.get('L2').listen((data) => {
  // ...Do something else with data
})

eventBus.emit({ foo: 'bar' })
eventBus.get('L2').emit({ fizz: 'bang' })
```

### Tree like event bus

A tree like tiered event bus.

- All `root` level events will bubble up.
- Events can be granular and be sent only into a specific level.
- Each level can act as another `root`

```typescript
import {} from '@magic8bot/event-bus'

const eventBus = new EventBus()

// Will onlt get events from `eventBus`
eventBus.listen((data) => {
  // ...Do something with data
})

// Will get events from `eventBus` and `eventBus -> L2.1`
eventBus.get('L2.1').listen((data) => {
  // ...Do something else with data
})

// Will get events from `eventBus` and `eventBus -> L2.2`
eventBus.get('L2.2').listen((data) => {
  // ...Do more with data
})

// Will get events from `eventBus`, `eventBus -> L2.2`, and `eventBus -> L2.2 -> L3`
eventBus
  .get('L2.2')('L3')
  .listen((data) => {
    // ...Do even more with data
  })

eventBus.emit({ foo: 'bar' })
eventBus.get('L2.1').emit({ fizz: 'bang' })
eventBus.get('L2.2').emit({ blep: 'cat' })
eventBus.get('L2.2')('L3').emit({ derp: 'dog' })
```
