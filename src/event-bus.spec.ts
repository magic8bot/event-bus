import { EventBus } from './event-bus'

describe('EventBus', () => {
  test('listens to and emits root level events', () => {
    const eventBus = new EventBus()
    const listener = jest.fn()
    eventBus.listen(listener)
    eventBus.emit()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('listens to and emits 2nd-level events', () => {
    const eventBus = new EventBus()
    const listener = jest.fn()

    eventBus.get('1').listen(listener)
    eventBus.emit()
    eventBus.get('1').emit()

    expect(listener).toHaveBeenCalledTimes(2)
  })

  test('listens to and emits multi-level events', () => {
    const eventBus = new EventBus()
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const listener3 = jest.fn()

    eventBus.listen(listener1)
    eventBus.get('1').listen(listener2)
    eventBus
      .get('1')('2')
      .listen(listener3)

    eventBus.emit()
    eventBus.get('1').emit()
    eventBus
      .get('1')('2')
      .emit()

    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(2)
    expect(listener3).toHaveBeenCalledTimes(3)
  })

  test('stops listening to events', () => {
    const eventBus = new EventBus()
    const listener = jest.fn()
    const unsub = eventBus.listen(listener)

    eventBus.emit()
    unsub()
    eventBus.emit()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  test("doesn't leak events across branches", () => {
    const eventBus = new EventBus()
    const listener1 = jest.fn()
    const listener2 = jest.fn()

    eventBus.get('1').listen(listener1)
    eventBus.get('2').listen(listener2)

    eventBus.get('1').emit()
    eventBus.get('2').emit()

    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)
  })

  test('deeply nested listners get events', () => {
    const eventBus = new EventBus()
    const listener = jest.fn()

    eventBus
      .get('1')('2')('3')('4')('5')
      .listen(listener)

    eventBus.emit()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('deeply nested listners get data', () => {
    const eventBus = new EventBus()
    const listener = jest.fn()

    eventBus
      .get('1')('2')('3')('4')('5')
      .listen(listener)

    eventBus.emit('data')

    expect(listener).toHaveBeenCalledWith('data')
  })

  test("ancestors don't get events", () => {
    const eventBus = new EventBus()
    const listener = jest.fn()

    eventBus.listen(listener)

    eventBus
      .get('1')('2')('3')('4')('5')
      .emit()

    expect(listener).toHaveBeenCalledTimes(0)
  })

  test("ancestors don't get data", () => {
    const eventBus = new EventBus()
    const listener = jest.fn()

    eventBus.listen(listener)

    eventBus
      .get('1')('2')('3')('4')('5')
      .emit('data')

    expect(listener).not.toHaveBeenCalledWith('data')
  })
})
