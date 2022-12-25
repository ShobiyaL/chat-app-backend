// const user = require("../Models/user");
var mongoose = require('mongoose');

class UserRepository {
    constructor () {}

createUser(user, data) {
    // var Message = mongoose.model('Message',{
    //     name : String,
    //     message : String
    //   });

    

//     mongoose.connect(dbUrl).then((ans) => {
//         console.log("ConnectedSuccessful")
//       }).catch((err) => {
//         console.log("Error in the Connection "+ err)
//       })
    // var user = new User(data);
    return new Promise((resolve, reject) => {
    user.find({},(err, messages)=> {
        console.log('called get msg ad emotted msg');
        // io.emit('message', 'req.body');
        // res.send(messages);
      })

    
    });
}

}
module.exports = UserRepository;