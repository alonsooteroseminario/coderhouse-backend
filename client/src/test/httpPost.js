const http = require('http')

const prod = JSON.stringify({
    title: "Arroz Blanco", 
    price: 200,
    thumbnail: "https://cdn2.iconfinder.com/data/icons/international-food/64/fried_rice-128.png"   
})

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/productos',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': prod.length
    }
}

const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        process.stdout.write(d)
    })
})

req.on('error', error => {
    console.log(error)
})

req.write(prod)

req.end()