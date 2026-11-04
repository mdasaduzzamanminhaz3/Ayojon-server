import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from 'cors';
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongoClient = await connectToMongoDB();
const db = mongoClient.db('ayojon');
const eventsCollection = db.collection('events');
const eventsCategoryCollection = db.collection('events-category');
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/event', async (req,res)=> {
    const data = req.body;
    const result = await eventsCollection.insertOne(data);
    console.log(result);
    res.send(result);
})
app.get('/events/upcoming', async (req,res)=> {
    const result = await eventsCollection.find({}).toArray();
    res.send(result);
})
app.get('/event/:id', async (req,res)=> {
    const {id} = req.params;
    const result = await eventsCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
})

app.delete('/event/:id', async (req,res)=> {
    const {id} = req.params;
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
});

app.patch('/event/:id', async (req,res)=> {
    const {id} = req.params;
    const data = req.body;
    const result = await eventsCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    res.send(result);
});




// category api 
app.get('/categories',async(req,res)=> {
    const result =await eventsCategoryCollection.find({}).toArray();
    res.send(result);
})
app.get('/category/:id', async (req,res)=> {
    const {id} = req.params;
    const result = await eventsCategoryCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
})
app.post('/category', async (req,res)=> {
    const data = req.body;
    const result = await eventsCategoryCollection.insertOne(data);
    res.send(result);
})

app.delete('/category/:id', async (req,res)=> {
    const {id} = req.params;
    const result = await eventsCategoryCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
});

app.patch('/category/:id', async (req,res)=> {
    const {id} = req.params;
    const data = req.body;
    const result = await eventsCategoryCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    res.send(result);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})