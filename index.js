require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
const cors = require("cors");

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

// middleware
app.use(cors(corsOptions));
app.use(express.json());

// user jobIOpro
// pass 2mJ8EIxUUNDy4F44








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnum3sy.mongodb.net/?retryWrites=true&w=majority`;

// const uri = "mongodb+srv://jobIOpro:2mJ8EIxUUNDy4F44@cluster0.mnum3sy.mongodb.net/?retryWrites=true&w=majority";




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobCollection = client.db("jobio").collection("jobs");
    const bidcollection = client.db("jobio").collection("bids");


    // for jobs
    app.get('/jobs', async (req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // my job
    app.get ('/jobpost', async (req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // for job details
    app.get ('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await jobCollection.findOne(query);
      res.send(result);
    })

    app.post('/jobs', async (req, res) => {
      const job = req.body;
      const result = await jobCollection.insertOne(job);
      res.send(result);
    })

    // for delete
    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    })
    


    // for bids
    app.get ('/bids', async (req, res) => {
      const cursor = bidcollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/mybid', async (req, res) => {
      const cursor = bidcollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/bids', async (req, res) => {
      const bid = req.body;
      const result = await bidcollection.insertOne(bid);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
  res.send("JobIO Server is running"); 
});

app.listen(port, () => {
  console.log(`JobIO Server is running on port: ${port}`);
})




