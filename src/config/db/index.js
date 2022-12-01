const mongoose = require('mongoose');
const mongodb = require('mongodb');

async function connect() {
    try {
        // const uri ='mongodb+srv://kinbiut:quocdatpro123@thuetro.uidqskh.mongodb.net/?retryWrites=true&w=majority';
        // const client = new MongoClient(uri);
        // const database = client.db('thuetro');
        // const thuenha = database.collection('thuenha');
        // const query = { name: 'nha dat' };
        // const result = await thuenha.findOne(query);
        // console.log(result);
        // mongodb+srv://QuocDat:<password>@cluster0.e7363.mongodb.net/natours?retryWrites=true&w=majority
        mongoose.connect(
            'mongodb+srv://huy:huy@cluster0.thlhxhz.mongodb.net/ProjectFinal?retryWrites=true&w=majority', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        console.log('DB connection successful!');
    } catch (error) {
        console.log(error);
        console.log('Failed connection!!!');
    }
}
module.exports = { connect };