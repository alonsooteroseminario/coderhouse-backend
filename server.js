const express = require("express");
const exphbs = require('express-handlebars');
const port = 8080;
const productRoutes = require("./routes/products");
const frontRoutes = require('./routes/front');
const app = express();

var hbs = exphbs.create({
  extname: "hbs",
  helpers: {
    lowercase: function (s) { return s.toLowerCase(); },
    full_name: (firstname, lastname) => firstname + " " + lastname,
    bold: options => {
      return '<div class = "mybold">' + options.fn(this) + "</div>";
    },
    mytitle: options => {
      return '<h2 class = "sarasa">' + options.fn(this) + "</h2";
    },
    ifeq: function(a,b,options) {
      if (a==b) { return options.fn(this);}
      return options.inverse(this);
    },
    ifnoteq: function(a,b,options) {
      if (a!=b) { return options.fn(this);}
      return options.inverse(this);
    },
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/', function(req, res) {
  res.render('home', {
    active: "home",
    person: {
      firstname: "Yehuda",
      lastname: "Katz",
    },
    people: [{
      name: "Lucas",
      age: 32
    },
    {
      name: "Alonso",
      age: 31
    },
    {
      name: "Gonzalo",
      age: 29
    }]
  });
});

app.get('/about', function(req, res) {
  res.render('about', {
    active: 'about'
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/productos", productRoutes);

app.use("/web", frontRoutes);

const server = app.listen(port, () => {
  console.log('El servidor esta corriendo en el puerto: ' + server.address().port);
});
server.on('error', err => console.log('Error message: ' + err));
