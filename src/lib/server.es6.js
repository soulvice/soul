/*
 *			STASH
 *			@author: s0ul
 *			@date: 13/05/2019
 *
 */

import sio from 'socket.io'
import utls from './utils'
import errors from './errors'
import http2 from 'http2'
import { readFileSync, promises as fsPromise } from 'fs'

const debug = utils.Debug('server');

export default class {
  constructor(app=null, opts={}) {
    const self = this;

    self._rootApp = app;
    self._uuid = utils.uid(20);

    // host and port
    self._host = opts.host || '127.0.0.1';
    self._port = opts.port || 3000;
    self._ssl = {};
    self._ssl.key =  opts.ssl.key;
    self._ssl.cert = opts.ssl.cert;

    // server
    self._http = null;
    self._connections = {};
    self._connectionId = 0;
    self._httpServer = null;

    //socket.io
    self._enableSocketio = opts.enableSocketio || false;
    self._socketio = null;

    debug(`:: new server created (${this._uuid})`);
  }

  async start() {
    const self = this;
    let fSSLData = {};

    /*
      Read SSL Key and Certificate
    */
    try {
      fSSLData.key = await fsPromise.readFile(self._ssl.key);
      debug(`:: ssl key has been read`, `- key length ${fSSLData.key.length}`);
    }catch (e) {
      throw e;
    }

    try {
      fSSLData.cert = await fsPromise.readFile(self._ssl.cert);
      debug(`:: ssl cert has been read`, `- cert length ${fSSLData.cert.length}`);
    }catch (e) {
      throw e;
    }

    /*
      Create Promise and start server creation
    */
    return new Promise((resolve, reject) => {
      self._http = http2.createSecureServer({
				allowHTTP1: false,
				secureProtocol: 'TLSv1.3',
        ...fSSLData
      }, self._rootApp.callback());

      debug(`:: created secure server  (${self._uuid})`);

      // socket.io
      if (self._enableSocketio) {
        self._socketio = sio(self._http);
      }

      // listen
      self._httpServer = self._http.listen(self._port, self._host);

      // http
      self._http.on('listening', () => {
        debug(`:: server started on port ${self._port} (${self._uuid})`);
        resolve(self);
      });

      self._http.on('connection', (socket) => {
        socket.__sockId = ++self._connectionId;

        socket.on('close', (had_err) => {
          delete self._connections[socket.__sockId];
        });

        self._connections[socket.__sockId] = socket;
      });

      self._http.on('error', (error) => {
        let svErr;

        if (error.errno === 'EADDRINUSE') {
          const pkgName = (utils.getPackageJSON && (utils.getPackageJSON.name || utils.getPackageJSON.alias)) || 'undefined';
          svErr = errors.SoulError({
            message: `Address already in use (EADDRINUSE).`,
            context: `Address already in use on port ${self._port}.`,
            help: `Make sure there is not already an instance of ${pkgName} running.`
          });
        }else{
          svErr = errors.SoulError({
            message: `Unknown Error`,
            context: `Error Code ${error.errno}.`,
            help: `Check documentation for error number.`
          });
        }
        reject(error);
      });
    });
  }

  async stop() {
    const self = this;

    function closeSocketio() {
      if (self._enableSocketio) {
        self._socketio.close();
      }
    }

    return new Promise((resolve, reject) => {
      if (self._http !== null) {
        resolve(self);
      }else{
        self._http.close(() => {
          debug(`:: server stopped (${self._uuid})`);
          self._http = null;
          resolve(self);
        });

        self.closeConnections();
      }
    }).then((selfID) => {
      closeSocketio();
      return selfID;
    });
  }

  async restart() {
    return this.stop().then(srv => srv.start());
  }

  async closeConnections() {
    const self = this;

    await Object.keys(self._connections).forEach(sockId => {
      let sock = self._connections[sockId];

      if (sock) {
        sock.destroy();
      }
    });
  }

  get socketio() {
    return this._socketio;
  }
}
