
const express = require('express')
const app = express()
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 3000
const cors = require("cors")


app.use(cors({ 
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}))
app.use(express.json())






// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7cujx3q.mongodb.net/?appName=Cluster0`;

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
     await client.connect();
     const db = client.db('Home-Nest')
     const homeCollection = db.collection('Homes')

     app.get('/Homes', async (req, res) =>{

        const result = await homeCollection.find().toArray()

        res.send(result)
     })

    
     app.get('/Homes/:id', async (req, res) =>{
      const {id} = req.params
       console.log(id)
       const objectId = new ObjectId(id)
       const result = await homeCollection.findOne({_id:objectId})
      
       res.send(
        {success:true,
          result

        })
    })

    
    

app.put('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProperty = req.body;
    const query = { _id: new ObjectId(id) };

    const updateDoc = {
      $set: {
        name: updatedProperty.name,
        description: updatedProperty.description,
        category: updatedProperty.category,
        price: updatedProperty.price,
        location: updatedProperty.location,
        image: updatedProperty.image
      }
    };

    const result = await homeCollection.updateOne(query, updateDoc);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Update failed' });
  }
});


     app.delete('/models/:id', async(req, res) => {
    const {id} = req.params
    console.log(id)
    const objectId = new ObjectId(id)
    const filter = {_id:objectId}
    const result = await homeCollection.deleteOne(filter)
    res.send({
      success:true,
      result
    })
   })

     app.get('/latest-homes', async (req, res) => {


    const result = await homeCollection.find().sort({postedAt:'desc'}).limit(6).toArray()
    console.log(result)
    res.send(result)
   })

   app.get('/users', async (req, res) => {
    const query = {}
    const email = req.query.email;
    if(query.email){
      query.userEmail=email;
    }
    const data = homeCollection.find(query);
    const result = await data.toArray();
    res.send(result)

  })

    app.post('/Homes', async (req, res)=> {
      const newProduct = req.body
      console.log(newProduct)
      newProduct.postedAt = new Date()
      const result = await homeCollection.insertOne(newProduct);
      res.send(result)
    })

   

   

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('server on')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
