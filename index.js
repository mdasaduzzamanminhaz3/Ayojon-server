import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from 'cors';
import { createRemoteJWKSet, jwtVerify } from 'jose';
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
const joinedCollection = db.collection('joined-events');



app.get('/', (req, res) => {
    res.send('Hello World!');
});
// middleware function for verify token
const verifyToken = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({msg:'Unauthorized'})
    }
    const token = authHeader.split(" ")[1]

    if(!token){
        return res.status(401).send({msg:'Unauthorized'})
    }


    const JWKS = createRemoteJWKSet(new URL('http://localhost:3000/api/auth/jwks'))
   try {
       const {payload} = await jwtVerify(token,JWKS)
       next()
    
   } catch (error) {
            return res.status(500).send({msg:'Server Error!'})
   }
   
}


app.post('/event',verifyToken,async (req, res) => {
  try {
    const data = req.body;

    if (!data.organizerEmail) {
      return res.status(400).send({
        message: "Organizer email is required",
      });
    }

    const result = await eventsCollection.insertOne(data);

    res.status(201).send({
      success: true,
      message: "Event created successfully",
      insertedId: result.insertedId,
    });

  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).send({
      message: "Failed to create event",
    });
  }
});

app.get("/my-events/:email", async (req, res) => {
    const { email } = req.params;

    const result = await eventsCollection
      .find({ organizerEmail: email })
      .toArray();
    res.send(result);
});


app.get('/events/upcoming', async (req,res)=> {
    const result = await eventsCollection.find({}).toArray();
    res.send(result);
})
app.get('/events/past', async (req,res)=> {
        const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
    }).format(new Date());

    const result = await eventsCollection
      .find({
        date: { $lt: today },
      })
      .sort({ date: -1 })
      .toArray();

    res.send(result);
})
app.get('/event/:id',verifyToken, async (req,res)=> {
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

//joined api
app.post('/join-event', async (req,res)=> {
    const data = req.body;
    const result = await joinedCollection.insertOne(data);
    res.send(result);
});

app.get('/joined-events/:email',async(req,res)=> {
    const {email} = req.params;
    const result = await joinedCollection.find({email:email}).toArray()
    res.send(result)
})

app.delete('/joined-events/:id',async(req,res)=> {
    const {id} = req.params
    const result = await joinedCollection.deleteOne({_id: new ObjectId(id)})
    res.send(result)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})