const mongoose = require("mongoose");
const { dbURI } = require("../core/index")
const { Schema } = mongoose;
/////////////////////////////////////////////////////////////////////////////////////////////////

// let dbURI = 'mongodb://localhost:27017/abc-database';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////


//  Franchise Start

var FranchiseSchema = mongoose.Schema({
    Name: String,
    Number: String,
    Location: String,
    StartTime: String,
    AtmTime: String,
    EndTime: String,
    CurrntTokenNumber: String,
    LastIssueNumber: String,
    Token: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token' }],

})

var Franchise = mongoose.model("Franchise", FranchiseSchema);

//  Franchise End
//  Token Start

var TokenSchema = mongoose.Schema({
    IMEI: String,
    TokenNumber: String,
    Time: String,
    FranchiseObjectID: String
})

var Token = mongoose.model("Token", TokenSchema);

//  Token End

module.exports = {

    Franchise: Franchise,
    Token: Token,
}