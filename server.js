var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require("express");
var exphbs = require('express-handlebars');
var productRoutes = require("./routes/products");
var frontRoutes = require('./routes/front');
var Archivo = require('./archivo');
var archivo = new Archivo();
var app = express();
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);
var hbs = exphbs.create({
    extname: "hbs",
    defaultLayout: 'main.hbs',
    helpers: {
        lowercase: function (s) { return s.toLowerCase(); },
        full_name: function (firstname, lastname) { return firstname + " " + lastname; },
        ifeq: function (a, b, options) {
            if (a == b) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        ifnoteq: function (a, b, options) {
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
    res.sendFile('./public/index.html', { root: __dirname });
});
io.on('connection', function (socket) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('Cliente conectado');
                socket.emit('productos', listaProductos);
                socket.on('boton', function (data) {
                    listaProductos.push(data);
                    console.log('boton presionado');
                    mostrados++;
                    io.sockets.emit('productos', listaProductos.slice(0, mostrados));
                });
                _b = (_a = socket).emit;
                _c = ['messages'];
                return [4 /*yield*/, archivo.leer()];
            case 1:
                _b.apply(_a, _c.concat([_d.sent()]));
                socket.on('new-message', function (data) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, archivo.guardar(data.author, data.text)];
                            case 1:
                                _d.sent();
                                _b = (_a = io.sockets).emit;
                                _c = ['messages'];
                                return [4 /*yield*/, archivo.leer()];
                            case 2:
                                _b.apply(_a, _c.concat([_d.sent()]));
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
var port = 8080;
var server = httpServer.listen(port, function () {
    console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', function (err) { return console.log('Error message: ' + err); });
