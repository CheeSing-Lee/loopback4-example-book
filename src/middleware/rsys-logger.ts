const dgram = require('dgram');
const net = require('net');
const os = require('os');
const util = require('util');
const winston = require('winston');
const {MESSAGE, LEVEL} = require('triple-beam');
const syslevels = winston.config.syslog;
const Transport = winston.Transport;

//
// ### function RSyslog (options)
// #### @options {Object} Options for this instance.
// Constructor function for the RSyslog transport object responsible
// for send messages to SysLog daemon
//
const Rsyslog = (exports.Rsyslog = function (options: {
  host?: string;
  port?: number;
  facility?: number;
  protocol?: string;
  hostname?: string;
  tag?: string;
}) {
  options = options || {};
  Transport.call(this, options);

  this.name = 'rsyslog';
  this.host = options.host ?? 'localhost';
  this.port = options.port ?? 514;
  this.facility = options.facility ?? 0;
  this.protocol = options.protocol ?? 'U';
  this.hostname = options.hostname ?? os.hostname();
  this.tag = options.tag ?? 'winston';

  if (this.facility > 23 || this.facility < 0) {
    throw new Error('Facility index is out of range (0..23) !');
  }

  if (this.protocol !== 'U' && this.protocol !== 'T') {
    throw new Error('Undefined Protocol (valid options are U or T) !');
  }
});

//
// Inherit from `winston.Transport`.
//
util.inherits(Rsyslog, winston.Transport);

//
// Add a new property to expose the new transport....
//
winston.transports.Rsyslog = Rsyslog;

//
// Expose the name of this Transport on the prototype
//
Rsyslog.prototype.name = 'rsyslog';

//
// ### function log (info, callback)
// #### @info {object} All relevant log information
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Rsyslog.prototype.log = function (info: any, callback: any) {
  if (this.silent) {
    return callback(null, true);
  }

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;
  const level = info[LEVEL];
  const msg = info[MESSAGE];

  // If the specified level is not included in syslog list, convert it into "debug".
  let _severity = 7;
  if (syslevels['levels'][level] !== undefined) {
    _severity = syslevels['levels'][level];
  }

  const _pri = (this.facility << 3) + _severity;
  const _date = new Date().toISOString();
  const _buffer = Buffer.from(
    '<' +
      _pri +
      '>' +
      _date +
      ' ' +
      this.hostname +
      ' ' +
      this.tag +
      ' ' +
      process.pid +
      ' - ' +
      level +
      ' - ' +
      JSON.stringify(msg),
  );

  if (this.protocol === 'U') {
    const client = dgram.createSocket('udp4');
    client.send(_buffer, 0, _buffer.length, this.port, this.host, function (
      err: Error,
    ) {
      if (err) {
        throw err;
      }

      self.emit('logged');

      if (callback) callback(null, true);
      callback = null;

      client.close();
    });
  }

  if (this.protocol === 'T') {
    const socket = net.connect(this.port, this.host, function () {
      socket.end(_buffer + '\n');

      self.emit('logged');

      if (callback) callback(null, true);
      callback = null;
    });

    socket.setTimeout(2000);

    socket.on('error', function (err: Error) {
      socket.close();
      throw err;
    });

    socket.on('timeout', function (err: Error) {
      socket.close();
      throw err;
    });
  }
};
