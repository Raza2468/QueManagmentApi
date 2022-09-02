const PORT = process.env.PORT || 5000;
const dbURI = process.env.dbURI || "mongodb+srv://faiz:2468@quemanagement.60wquoy.mongodb.net/?retryWrites=true&w=majority";

//change dburl put create cluster url

module.exports = {
    PORT: PORT,
    dbURI: dbURI,
};