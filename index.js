require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

// middleware
app.use(cors(corsOptions));
app.use(express.json());










const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnum3sy.mongodb.net/?retryWrites=true&w=majority`;






// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



// my middleware
// const logger = async (req, res, next) => {
//   console.log('called::', req.host, req.originalUrl)
//   next()
// }

// const verifyToken = async (req, res, next) => {
//   const token = req.cookies?.token;
//   console.log('value of token in middleware', token)
//   if(!token){
//     return res.status(401).send({message: 'Not Authorized'})
//   }

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if(err){
//       console.log(err)
//       return res.status(401).send({message: 'Unauthorized'})
//     }

//     console.log('value in the token', decoded)
//     req.user = decoded

//     next()
//   })


 
// }





async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobCollection = client.db("jobio").collection("jobs");
    const bidcollection = client.db("jobio").collection("bids");


    // auth related api
    // app.post('/jwt', async (req, res) => {
    //   const user = req.body;
    //   console.log(user);
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})


    //   res
    //   .cookie('token', token, {
    //     httpOnly: true,
    //     secure: false,
       

    //   })
    //   .send({success: true})
    // })


    // for jobs
    app.get('/jobs',  async (req, res) => {
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

    // for update job
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await jobCollection.findOne(query);
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

    // for update
    app.put ('/jobs/:id', async (req, res) => {
     const id = req.params.id;
     const filter = {_id: new ObjectId(id)};
     const options = {upsert: true};
     const updatedJob = req.body;
     console.log(updatedJob)
     const job = {
       $set:{
        email: updatedJob.email,
        job: updatedJob.job,
        deadline: updatedJob.deadline,
        description: updatedJob.description,
        maxprice: updatedJob.maxprice,
        minprice: updatedJob.minprice,
        category: updatedJob.category
       }
     }
     const result = await jobCollection.updateOne(filter, job, options)
     res.send(result)
    
    })


    


    // for bids
    app.get ('/bids',   async (req, res) => {
      console.log(req.query.email)
      // console.log('token from client', req.cookies.token)
      // console.log('user in the valid token', req.user)
      // if(req.query?.email !== req.user?.email){
      //   return res.status(403).send({message: 'Forbidden Access'})
      // }



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

    // for update btn
    // app.patch('/bids/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const filter = {_id: new ObjectId(id)};
    //   const updatedJob = req.body;
    //   console.log(updatedJob);
    //   const updatedDocs = {
    //     $set: {
    //       status: updatedJob.status
    //     },
    //   }
    //   const result = await bidcollection.updateOne(filter, updatedDocs);
    //   res.send(result);
    // })

    app.patch('/bids/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const { status } = req.body;
    
        if (!status) {
          return res.status(400).send({ error: 'Status is required in the request body.' });
        }
    
        // Check if the status is either "accepted" or "rejected"
        if (status !== 'Accept' && status !== 'Reject') {
          return res.status(400).send({ error: 'Invalid status. It must be either "accepted" or "Rejected".' });
        }
    
        const updatedDocs = {
          $set: {
            status: status
          },
        };
    
        const result = await bidcollection.updateOne(filter, updatedDocs);
    
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    });

    


   


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













// res.cookie(
//   "token",
//   tokenValue,
//   {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production" ? true: false,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//   }
// )

// Removing/Deleting cookie:
// res.clearCookie(
//   "token",
//   {
//       maxAge: 0,
//       secure: process.env.NODE_ENV === "production" ? true: false,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//   }
// )

// res.cookie(
//   "token",
//   tokenValue,
//   {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production" ? true: false,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//   }
// )

// Removing/Deleting cookie:
// res.clearCookie(
//   "token",
//   {
//       maxAge: 0,
//       secure: process.env.NODE_ENV === "production" ? true: false,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//   }
// )

// res.cookie(
//   "token",
//   tokenValue,
//   {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production" ? true: false,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//   }
// )

// Removing/Deleting cookie:
// res.clearCookie(
//   "token",
//   {
//       maxAge: 0,
//       secure: process.env.NODE_ENV === "production" ? true: false,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//   }
// )