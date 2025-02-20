const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 3000;

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://nirobaurnab:Ou9w7Uv6ZTRHD2qV@cluster0.nhkvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const userCollection = client.db('treehouse').collection('tickets_user');
    const ticketsCollection = client.db('booksDB').collection('tickets_DB');


    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    app.get('/tickets', async (req, res) => {
      const query = {};
      const cursor = ticketsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post('/tickets', async (req, res) => {
      const ticket = req.body;
      const result = await ticketsCollection.insertOne(ticket);
      res.send(result);
    });
    app.delete('/tickets/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ticketsCollection.deleteOne(query);
      res.send(result);
    });
    app.get('/tickets/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const ticket = await ticketsCollection.findOne({ _id: new ObjectId(id) });

        if (!ticket) {
          return res.status(404).send({ message: 'Ticket not found' });
        }

        res.send(ticket);
      } catch (error) {
        console.error("Error fetching ticket:", error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    app.put('/tickets/:id', async (req, res) => {
      const id = req.params.id;
      const updateItem = req.body;
      const query = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateItem.name,
          studentId: updateItem.studentId,
          email: updateItem.email,
          motherName: updateItem.motherName,
          fatherName: updateItem.fatherName,
          result: updateItem.result

        }
      };
      const result = await ticketsCollection.updateOne(query, updateDoc, option);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Server is running");
})

app.listen(port, () => {
  console.log(`Hello server connected on ${port}`);
})