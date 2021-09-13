const http = require('http')

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/productos',
    method: 'GET'
}

const req = http.request(options, res => {
    
    let response = ''

    res.on('data', d => response += d)
    
    res.on('end', () => {
        const data = JSON.parse(response);
        console.log(data)
    })
})

req.on('error', error => {
    console.log(error)
})


req.end()