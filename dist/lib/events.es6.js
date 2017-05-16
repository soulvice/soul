'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 soul
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 the soul of your applications in one place.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

//import { utils } from 'soul'


var EventRegistry = function (_EventEmitter) {
  _inherits(EventRegistry, _EventEmitter);

  function EventRegistry() {
    _classCallCheck(this, EventRegistry);

    return _possibleConstructorReturn(this, (EventRegistry.__proto__ || Object.getPrototypeOf(EventRegistry)).call(this));
  }

  _createClass(EventRegistry, [{
    key: 'onMany',
    value: function onMany(arr, onEvent) {
      var self = this;

      arr.forEach(function (eventName) {
        self.on(eventName, onEvent);
      });
    }
  }]);

  return EventRegistry;
}(_events.EventEmitter);

var EventRegistryInstance = new EventRegistry();
EventRegistryInstance.setMaxListeners(100);

exports.default = EventRegistryInstance;