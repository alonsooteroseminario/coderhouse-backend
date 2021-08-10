const express = require('express');
var { graphqlHTTP }  = require('express-graphql');
var { buildSchema } = require('graphql');
const faker = require('faker');
faker.locale = 'es'
const router = express.Router();
const ProductoDB = require('./../DB/productoDb');
const productoDB = new ProductoDB();
const MockAPI = require('../controllers/mockAPI');
const { transporter, transporterGmail } = require('../controllers/email');
const api = new MockAPI();

var schema = buildSchema(`
    type Query {
        message: String,
        messages: [String],
        numero: Int,
        numeros: [Int],
        course(id: Int!): Course
        courses(topic: String): [Course]
        cursos: [Course]
        cursos2: [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }    
`);

var coursesData = [
  {
      id: 1,
      title: 'The Complete Node.js Developer Course',
      author: 'Andrew Mead, Rob Percival',
      description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
      topic: 'Node.js',
      url: 'https://codingthesmartway.com/courses/nodejs/'
  },
  {
      id: 2,
      title: 'Node.js, Express & MongoDB Dev to Deployment',
      author: 'Brad Traversy',
      description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
      topic: 'Node.js',
      url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
  },
  {
      id: 3,
      title: 'JavaScript: Understanding The Weird Parts',
      author: 'Anthony Alicea',
      description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
      topic: 'JavaScript',
      url: 'https://codingthesmartway.com/courses/understand-javascript/'
  }
]

var getCourse = function(args) { 
  var id = args.id;
  return coursesData.filter(course => {
      return course.id == id;
  })[0];
}
var getCourses = function(args) {
  if (args.topic) {
      var topic = args.topic;
      return coursesData.filter(course => course.topic === topic);
  } else {
      return coursesData;
  }
}

var getCursos = function() {
  return coursesData
}

var updateCourseTopic = function({id, topic}) {
  coursesData.map(course => {
      if (course.id === id) {
          course.topic = topic;
          return course;
      }
  });
  return coursesData.filter(course => course.id === id) [0];
}

// Root resolver
var root = {
  message: () => 'Hola Mundo!',
  messages: () => 'Hola Mundo!'.split(' '),
  numero: () => 123,
  numeros: () => [1,2,3],
  course: getCourse,
  courses: getCourses,
  cursos: getCursos,
  cursos2: () => coursesData,
  updateCourseTopic: updateCourseTopic
};

router.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

router.get("/vista", async (req, res) => {
  if (!req.user.contador) {
    req.user.contador = 0
  }
  const products = await productoDB.listar();
  res.render('vista', {
    active: "vista",
    products: products,
    user: req.user,
  });
  req.user.contador++
});
router.get("/vista/:id", async (req, res) => {
    const { id } = req.params;
    const currentProduct = await productoDB.listarPorId(id);

    if (currentProduct) {

      return res.json(currentProduct);
    }
    res.status(404).json({
      error: "producto no encontrado",
    });
});
router.get("/vista-test/:cant?", async (req, res) => {
    console.log(req.params.cant);
    if (req.params) {
  
      api.popular(req.params.cant);
      // res.json(api.obtenerPorId(req.params.id))
      const products = api.obtenerTodos();;
      res.render('vista', {
        active: "vista",
        products: products
      });
  
  
  
    } else {
  
      api.popular();
      const products = api.obtenerTodos();
      res.render('vista', {
        active: "vista",
        products: products
      })
      if (products.length == 0) {
        res.status(404).json({
          error: "no hay productos cargados",
        });
      }
  
  
    }
});
router.get('/nuevo-producto', async (req, res) => {
    if (!req.user.contador) {
        req.user.contador = 0
    }
    res.render('nuevo-producto', {
        active: 'nuevo-producto',
        user: req.user
    })
})
router.post("/vista", async (req, res) => {
    const data = req.body;
    const products = await productoDB.listar();
    data.id = products.length + 1;
    products.push({
      id: data.id,
      title: data.title,
      price: parseInt(data.price),
      thumbnail: data.thumbnail,
    })

    if(await productoDB.insertar(products).catch((err)=>{
      console.log(err)
    })) {
      // if (data.form === "1") return res.redirect('http://localhost:8080/nuevo-producto');
      res.redirect('http://localhost:8080/producto/nuevo-producto').status(201).json(data);
    }
    res.status(400).send();
});



router.put("/vista/:id", async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    if(await productoDB.actualizarPorId(id, data)) {

      res.status(201).json(data);
    }
    res.status(400).send();
});
router.delete("/vista/:id", async (req, res) => {
    const { id } = req.params;
    const currentProduct = await productoDB.borrarPorId(id);
    res.json(currentProduct);
});



module.exports = router;