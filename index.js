const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.hgznyse.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const webCollection = client.db("flexJobsDB").collection('web');
        const marketingCollection = client.db("flexJobsDB").collection('marketing');
        const graphicsCollection = client.db("flexJobsDB").collection('graphics');

        // get all data from database
        app.get('/web', async (req, res) => {
            const result = await webCollection.find().toArray();
            res.send(result);
        })

        // get all data from database
        app.get('/marketing', async (req, res) => {
            const result = await marketingCollection.find().toArray();
            res.send(result);
        })

        // get all data from database
        app.get('/graphics', async (req, res) => {
            const result = await graphicsCollection.find().toArray();
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Your server is ready !')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})