"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require("express");
var exphbs = require('express-handlebars');
var productRoutes = require("./routes/products");
var frontRoutes = require('./routes/front');
var Archivo = require('./archivo');

// import express from 'express';
// import exphbs from 'express-handlebars';
// import { Server as HttpServer } from 'http';
// import { Server as IOServer } from 'socket.io';
// import productRoutes from './routes/products';
// import frontRoutes from './routes/front';
// import Archivo from './archivo.js';

var archivo = new Archivo();

var app = express();
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);
// const httpServer = new HttpServer(app);
// const io = new IOServer(httpServer);


var hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: 'main.hbs',
  helpers: {
    lowercase: function lowercase(s) {
      return s.toLowerCase();
    },
    full_name: function full_name(firstname, lastname) {
      return firstname + " " + lastname;
    },
    bold: function bold(options) {
      return '<div class = "mybold">' + options.fn(undefined) + "</div>";
    },
    mytitle: function mytitle(options) {
      return '<h2 class = "sarasa">' + options.fn(undefined) + "</h2>";
    },
    ifeq: function ifeq(a, b, options) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    ifnoteq: function ifnoteq(a, b, options) {
      if (a != b) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use("/api/productos", productRoutes);
app.use("/api/nuevo-producto", frontRoutes);

var mostrados = 0;
var listaProductos = [];

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});

io.on('connection', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(socket) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('Cliente conectado');
            socket.emit('productos', listaProductos);

            socket.on('boton', function (data) {
              listaProductos.push(data);
              console.log('boton presionado');
              mostrados++;
              io.sockets.emit('productos', listaProductos.slice(0, mostrados));
            });

            _context2.t0 = socket;
            _context2.next = 6;
            return archivo.leer();

          case 6:
            _context2.t1 = _context2.sent;

            _context2.t0.emit.call(_context2.t0, 'messages', _context2.t1);

            socket.on('new-message', function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return archivo.guardar(data.author, data.text);

                      case 2:
                        _context.t0 = io.sockets;
                        _context.next = 5;
                        return archivo.leer();

                      case 5:
                        _context.t1 = _context.sent;

                        _context.t0.emit.call(_context.t0, 'messages', _context.t1);

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

var port = 8080;
var server = httpServer.listen(port, function () {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', function (err) {
  return console.log('Error message: ' + err);
});
