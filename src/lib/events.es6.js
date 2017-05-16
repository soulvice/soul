/*
  soul

  the soul of your applications in one place.
*/

//import { utils } from 'soul'
import { EventEmitter } from 'events'


class EventRegistry extends EventEmitter {
  constructor() {
    super()
  }

  onMany(arr, onEvent) {
    var self = this;

    arr.forEach((eventName) => {
        self.on(eventName, onEvent);
    });
  }
}

const EventRegistryInstance = new EventRegistry();
EventRegistryInstance.setMaxListeners(100);

export default EventRegistryInstance
