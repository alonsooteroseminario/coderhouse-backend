const min = 0;
const max = 1000;
// Retorna un número aleatorio entre min (incluido) y max (excluido)
function getRandomArbitrary() {
    return Math.random() * (max - min) + min;
}

getRandomArbitrary();


  