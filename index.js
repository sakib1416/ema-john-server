const express = require("express");
const app = express();
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yfcjm.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    //creating collections
    const products = client.db("emaJohnStore").collection("products");
    const orders = client.db("emaJohnStore").collection("orders");
    console.log("Database connected");

    app.post("/addProduct", (req,res) => {
        const allProducts = req.body;
          products.insertOne(allProducts)
          .then(result => {
              res.send(result);
          })
    });

    app.get("/products", (req,res) => {
        //finding everything and sending it as an array
        products.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    //loading a specific product searching it with key, and then sending it
    app.get("/product/:key", (req,res) => {
        products.findOne({key: req.params.key})
        .then(result => {
            res.send(result);
        })
    });

    //loading more than 1 products
    app.post("/productByKeys", (req,res) => {
        //retrieving the product keys from the body and sending it as an array
        const productKeys = req.body;
        products.find({key: {$in: productKeys}})
        .toArray((err,documents) => {
            res.send(documents);
        })
    });

    //posting orders in orders collection
    app.post("/addOrder", (req,res) => {
        const order = req.body;
        orders.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        });
    });
});

app.get("/", (req,res) => {
    res.send("Hello from the server side");
});


app.listen(process.env.PORT ||5000, () => {
    console.log("Server started");
});