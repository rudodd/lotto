// import library functionality
import clientPromise from '../../utils/mongodb';

// Get user and plays data from the db
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('lotto');
  const plays = await db.collection('plays').find({}).toArray();
  let play;
  switch(req.method) {
    case 'POST':
      const { email } = req.body;
      const users = await db.collection('users').find({}).toArray();
      let matchingUser = users.find((user) => user.email === email);
      if (!matchingUser) {
        const post = await db.collection('users').insertOne({ email: email });
        matchingUser = {...post, _id: post.insertedId}; 
      }
      play = plays.find((p) => p.userId === matchingUser._id.toString());
      res.status(200).json({user: matchingUser, plays: play ? play : null});
      break;
    case 'PUT':
      play = plays.find((p) => p.userId === req.body.id);
      let put;
      if (play) {
        put = await db.collection('plays').updateOne(
          {_id: play._id},
          {
            $set: { userId: req.body.id, numbers: req.body.numbers, drawingDate: req.body.drawingDate },
            $currentDate: { lastModified: true }
          }
        );
      } else {
        put = await db.collection('plays').insertOne({ userId: req.body.id, numbers: req.body.numbers, drawingDate: req.body.drawingDate });
      }
      res.status(200).json(put);
      break;
    default:
      res.status(200).json({message: 'No matching method to call'})
  }



  // res.status(200).json();

  // await db.collection('users').deleteMany({});
  // return res.status(200).json({ message: 'All users deleted' });
}