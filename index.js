const express = require('express');
var bodyParser = require('body-parser')
const app = express();

// app.set('view engine', 'pug');
// app.set('views', './views');

const port = 4000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'shops',
    password: 'TranChuong22662',
    port: 5432,
})

app.get('/', (req, res) => { })

app.get('/getcartitems', (req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    pool.query('select * from cart_items', async (error, response) => {
        if (error) {
            console.log(error);
        }
        else {
            let list = response.rows.map((i, index) => {
                return i;
            })

            await Promise.all(list.map(async (i, index) => {

                const items = await pool.query(`select * from items where items.idcartitem = ${i.id}`)

                list[index].items = items.rows
            }))

            res.send(list);
        }
    })
})


// app.post('/add', function (req, res, next) {
//     const product_name = req.body.product_name,
//         product_price = req.body.product_price;


//     pool.query("INSERT INTO product_info (product_name,product_price) values ($1,$2)", [product_name, product_price], (err, response) => {
//         if (err) {
//             res.send(err)
//         }
//         else {
//             res.send('insert success' + product_name + product_price);
//         }
//     })
// })

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
