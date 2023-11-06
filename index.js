const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        const jobsCollection = client.db("flexJobsDB").collection('jobs');
        const bidsCollection = client.db("flexJobsDB").collection('bids');

        // post method
        app.post('/jobs', async (req, res) => {
            const jobsInfo = req.body;
            const result = await jobsCollection.insertOne(jobsInfo);
            res.send(result);
        });

        // post method
        app.post('/bids', async (req, res) => {
            const bids = req.body;
            const result = await bidsCollection.insertOne(bids);
            res.send(result);
        });

        // get method
        app.get('/jobs', async (req, res) => {
            const result = await jobsCollection.find().toArray();
            res.send(result);
        })

        // get method
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.findOne(query);
            res.send(result);
        })

        // update method
        app.put('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateJob = req.body;
            const jobs = {
                $set: {
                    email: updateJob.email,
                    title: updateJob.title,
                    deadline: updateJob.deadline,
                    description: updateJob.description,
                    category: updateJob.category,
                    price: updateJob.price
                }
            }
            const result = await jobsCollection.updateOne(filter, jobs, options);
            res.send(result)
        })

        // delete method
        app.delete('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.deleteOne(query);
            res.send(result)
        })


        // get data from database
        app.get('/jobs', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await jobsCollection.find(query).toArray();
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