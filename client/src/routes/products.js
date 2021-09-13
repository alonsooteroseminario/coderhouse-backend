const express = require('express');
var { graphqlHTTP }  = require('express-graphql');
var { buildSchema } = require('graphql');
const faker = require('faker');
faker.locale = 'es'
const router = express.Router();
const factory = require('../DB/factory');
const productoDB = factory;

const MockAPI = require('../controllers/mockAPI');
const api = new MockAPI();

router.get("/vista", async (req, res) => {
  try {
    if (!req.user.contador) {
      req.user.contador = 0
    }
    res.status(200).render('vista', {
      active: "vista",
      user: req.user,
    });
    req.user.contador++
  } catch (error) {
    console.log(error)
  }
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

var schema = buildSchema(`
    type Query {
        productos: [Product]
    },
    type Mutation {
        updateProductTopic(id: Int!, title: String!, price: String!, thumbnail: String! ): Product
        agregarProductoGraphql(title: String!, price: String!, thumbnail: String!): [Product]
        deleteProductGraphql(id: Int!): Product
        listarProductIdGraphql(id: Int!): Product
    },
    type Product {
        id: Int
        title: String
        price: String
        thumbnail: String
    }    
`);

var getProductos = async function() {
  return await productoDB.listar();
}
var updateProductTopic = async function({id, title, price, thumbnail}) {
  let data = {
    title,
    price,
    thumbnail
  }
  return await productoDB.actualizarPorId(id, data)
}
//funcion para POST 
var agregarProductoGraphql = async function({title, price, thumbnail}, res) {

  const products = await productoDB.listar();
  products.push({
    id: products.length + 1,
    title: title,
    price: parseInt(price),
    thumbnail: thumbnail,
  })

  await productoDB.insertar(products).catch((err)=>{
    console.log(err)
  })
  res.redirect('http://localhost:8080/producto/nuevo-producto')
  return products;
}
var deleteProductGraphql = async function({id}) {
  const currentProduct = await productoDB.borrarPorId(id);
  return currentProduct;
};
var listarProductIdGraphql = async function({id}) {
  const currentProduct = await productoDB.listarPorId(id);
  return currentProduct;
}

// Root resolver
var root = {
  agregarProductoGraphql: agregarProductoGraphql,
  productos: getProductos,
  updateProductTopic: updateProductTopic,
  deleteProductGraphql: deleteProductGraphql,
  listarProductIdGraphql: listarProductIdGraphql
};

router.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

module.exports = router;