const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: String,
    image:{
        data: Buffer,
        contentType: String,
    }
});
let collectionName = 'Image';
const Image = mongoose.model(collectionName, userSchema, collectionName) //third one probably forces to use the given name

// let usr = { username: 'dorjee', password: require("bcryptjs").hashSync('hi', 10), name: 'Dorjee Lama' }

// Users.create(usr)
//     .then(x => console.log(x))
//     .catch(err => { return done(err) });

module.exports = Image;
