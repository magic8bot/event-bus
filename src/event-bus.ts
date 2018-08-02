type EventBusEvent = (eventBusData?: any) => void

interface EventBusGetterer {
  (eventName: string): EventBusGetterer
  emit?: (eventBusData?: any) => void
  listen?: (fn: EventBusEvent) => void
}

export class EventBus {
  private readonly listeners: Set<EventBusEvent> = new Set()
  private readonly emitters: Map<string, EventBus> = new Map()

  public get(eventName: string) {
    if (!this.emitters.has(eventName)) this.emitters.set(eventName, new EventBus())

    return this.getter(this.emitters.get(eventName))
  }

  public emit = (eventBusData?: any) => {
    this.listeners.forEach((listener) => listener(eventBusData))
    this.emitters.forEach((emitter) => emitter.emit(eventBusData))
  }

  public listen = (fn: EventBusEvent) => {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private getter(bus: EventBus) {
    const get: EventBusGetterer = function(eventName: string) {
      return bus.get(eventName)
    }

    get.listen = bus.listen
    get.emit = bus.emit

    return get
  }
}
