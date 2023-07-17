const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xlwfmf.mongodb.net/?retryWrites=true&w=majority`;

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

    const universityCollection = client.db('job').collection('university')
    const courseCollection = client.db('job').collection('courses')

    app.get('/university',async(req,res)=>{
        const result = await universityCollection.find().toArray();
        res.send(result)
    })

    app.get('/university/:name', async (req, res) => {
      const name = req.params.name;
      const query = { name: name };
      const result = await universityCollection.findOne(query);
      res.send(result);
    });

    app.get('/universitySearch/:text',async(req,res) => {
      const searchUniversity = req.params.text;

      const result = await universityCollection.find({
        name: {$regex: searchUniversity,$options: 'i'}
      }).toArray()
      res.send(result)
    })

    app.get('/course',async(req,res)=>{
      const result = await courseCollection.find().toArray();
      res.send(result)
  })

  app.get('/course/:name', async (req, res) => {
    const name = req.params.name;
    const query = { name: name };
    const result = await courseCollection.findOne(query);
    res.send(result);
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


app.get('/',(req,res)=>{
    res.send('Server is running')
})
app.listen(port,()=>{
    console.log(`Job task server is running on port ${port}`)
})