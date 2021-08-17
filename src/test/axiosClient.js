const axios = require('axios')

const producto = {
    title: 'Arroz Blanco', 
    price: '200',
    thumbnail: 'https://cdn2.iconfinder.com/data/icons/international-food/64/fried_rice-128.png'
}

const axiosGet = async () => {
    try {
        const resp = await axios.get('http://localhost:8080/productos/vista');
        // console.log(resp.data)
    } catch (err) {
        console.log(err);
    }
};

axiosGet();


async function axiosPost() {

    let prod = { 
        title: 'Arroz Blanco', 
        price: '200',
        thumbnail: 'https://cdn2.iconfinder.com/data/icons/international-food/64/fried_rice-128.png'
    };

    let res = await axios.post('http://localhost:8080/productos/vista', prod);

    let data = res.data;
    // console.log(data);
}

axiosPost();


const axiosPut = async () => {
    try {
        let prod = { 
        title: 'Arroz Blanco', 
        price: '1200',
        thumbnail: 'https://cdn2.iconfinder.com/data/icons/international-food/64/fried_rice-128.png'
    };
        const resp = await axios.put('http://localhost:8080/productos/vista/60f97f080f0cc209e861e486'/*copiar ID segun producto de la DB*/, prod);
        // console.log('PUT',resp);
    } catch (err) {
        console.log(err);
    }
};
axiosPut();



const axiosDelete = async () => {
    try {
        
        const resp = await axios.delete('http://localhost:8080/productos/vista/60f97f080f0cc209e861e486');
        // console.log('DELETE',resp);
    } catch (err) {
        console.log(err);
    }
};

axiosDelete();