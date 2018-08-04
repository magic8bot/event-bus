type EventBusEvent<T = any> = (eventBusData?: T) => void

export interface EventBusNode {
  (eventName: string): EventBusNode
  emit?: <T = any>(eventBusData?: T) => void
  listen?: <T = any>(fn: EventBusEvent<T>) => void
}

export class EventBus {
  private readonly listeners: Set<EventBusEvent> = new Set()
  private readonly emitters: Map<string, EventBus> = new Map()

  public get(eventName: string) {
    if (!this.emitters.has(eventName)) this.emitters.set(eventName, new EventBus())

    return this.getter(this.emitters.get(eventName))
  }

  public emit = <T = any>(eventBusData?: T) => {
    this.listeners.forEach((listener) => listener(eventBusData))
    this.emitters.forEach((emitter) => emitter.emit(eventBusData))
  }

  public listen = <T = any>(fn: EventBusEvent<T>) => {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private getter(bus: EventBus) {
    const get: EventBusNode = function(eventName: string) {
      return bus.get(eventName)
    }

    get.listen = bus.listen
    get.emit = bus.emit

    return get
  }
}
