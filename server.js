var express = require('express');
require('dotenv').config();
var bodyParser = require('body-parser')
var app = express();
var util = require('util')

const userRepository = require('./repositories/UserRepository');
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
var mongoose = require('mongoose');
var cors = require('cors')

app.use(cors())

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var Message = mongoose.model('Message', {
  fromUserName: String,
  toUserName: String,
  message: String
})
var User = mongoose.model('User', {
  userName: String,
  password: String
})


app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    console.log('called get msg ad emotted msg');
    // io.emit('message', 'req.body');
    res.send(messages);
  })
})

app.post('/user/chat', (req, res) => {
  // console.log('called user/chat from-'+req.body.fromUserName);
  Message.find(req.body, (err, messages) => {
    console.log('called user/chat for chathistory fromUserName - '+JSON.stringify(req.body));
    // io.emit('message', 'req.body');
    res.send(messages);
  })
})


app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({ name: user }, (err, messages) => {
    res.send(messages);
  })
})

app.post('/users', async(req, res) => {
  // var user = req.params.user
  let users = [];
  await User.find({}, async (err, usersDocuments) => {
      // handle err
      console.log(usersDocuments.length);
      // usersDocuments formatted as desired
      // users =  await getUserNamesFromCollection(usersDocuments);
      for (let i=0;i<usersDocuments.length;i++){
        // usersDocuments.forEach(doc => {
          console.log('printing user names '+usersDocuments[i]['userName']);
          users.push(usersDocuments[i]['userName']);
          // console.log('printing user names '+doc['userName'] + doc);
        }
        res.send(users);
    });
    console.log('printing user names at end '+ users);;
    res.send(users);
});


app.post('/messages', async (req, res) => {
  try {
    var message = new Message(req.body);

    var savedMessage = await message.save()
    console.log('saved ' + req.body);

    var censored = await Message.findOne({ message: 'badword' });
    if (censored)
      await Message.remove({ _id: censored.id })
    else{
      console.log('emitted');
      io.emit('message', req.body);
    }
    res.sendStatus(200);
  }
  catch (error) {
    res.sendStatus(500);
    return console.log('error', error);
  }
  finally {
    console.log('Message Posted')
  }

})

app.post('/signup', async (req, res) => {
  console.log('Signup caled ');
  // console.log(util.inspect(req))
  try {

    var user = new User(req.body);
    let user1 = await User.findOne({ userName: req.body.userName });
    if (user1 == null) {
      var savedUser = await user.save()
      res.send(true);
      console.log('saved user - ' + savedUser.userName);
    } else {
      res.send(false);
      console.log('user exists ');
    }
  }
  catch (error) {
    res.sendStatus(500);
    return console.log('error', error);
  }

})

app.post('/login', async (req, res) => {
  console.log('login caled ');
  // console.log(util.inspect(req))
  try {

    var user = new User(req.body);
    let user1 = await User.findOne({ userName: req.body.userName, password: req.body.password });
    if (user1 == null) {
      // var savedUser = await user.save()
      res.send(false);
      console.log('user not found- ' + savedUser.userName);
    } else {
      res.send(true);
      console.log('user found');
    }
  }
  catch (error) {
    res.sendStatus(500);
    return console.log('error', error);
  }

})


io.on('connection', () => {
  console.log('a user is connected')
})

async function getUserNamesFromCollection(docs) {
  let users = [];
  
    return users;
}

mongoose.connect(process.env.dbUrl).then((ans) => {
  console.log("ConnectedSuccessful")
}).catch((err) => {
  console.log("Error in the Connection " + err)
})

var server = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});
