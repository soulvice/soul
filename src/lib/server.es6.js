/*
  Soul v2

  @author: Soulvice
  @date: 10-07-2017

*/


import utils from './utils'
import errors from './errors'

const debug = utils.Debug('server');

export default class Server {
  static OTPS = {
    HTTP: 1,
    HTTPS: 2
  }

  constructor(app=null, opts={}) {
    this._connections = {};
    this._connectionId = 0;

    this._opts = {};
    this._opts.host = opts.host || '127.0.0.1';
    this._opts.port = opts.port || 3000;
    /*
      TODO:
        - add ssl/https support
    */

    this._http = null;
    this._rootApp = app;

    this._uuid = utils.uid(20);
    debug(`:: new server created (${this._uuid})`);
  }

  async start() {
    const self = this;
    return new Promise((resolve, reject) => {
      self._http = self._rootApp.listen(self._opts.port, self._opts.host);

      self._http.on('listening', () => {
        debug(`:: server started on port ${self._opts.port} (${self._uuid})`);
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
            context: `Address already in use on port ${self._opts.port}.`,
            help: `Make sure there isn\'t already an instance of ${pkgName} running.`
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
}
