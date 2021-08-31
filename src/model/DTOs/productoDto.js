const productoDto = (producto) => {
  return myDto = {
    fyh: new Date().toLocaleString(),
    title: producto.title,
    price: producto.price,
    thumbnail: producto.thumbnail,
  };
};

module.exports = productoDto;
