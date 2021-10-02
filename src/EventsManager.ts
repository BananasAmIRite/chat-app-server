import EventEmitter from 'events';

export default class EventsManager extends EventEmitter {
  on<K extends keyof Events>(eventName: K, listener: (...args: Events[K]) => void): this {
    // @ts-ignore
    return super.on(eventName, listener);
  }

  emit(eventName: any, ...args: any[]): boolean;
  emit<K extends keyof Events>(eventName: K, ...args: Events[K]): boolean {
    return super.emit(eventName, ...args);
  }
}

export interface Events {
  ChatRequest: [
    token: string,
    data: {
      name: 'ChatRequest';
      message: string;
      roomId: number;
    }
  ];
}
