const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
// var authRoutes = require("./routes/auth");

const app = express();

const { PORT } = require("./core/index");
const { Franchise, Token } = require("./dbmodule/module");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "*",
    credentials: true,
})
);


app.use(express.json());
app.use(morgan("short"));


// post franchies data

app.post("/franchise", (req, res, next) => {

    if (!req.body.Name) {

        res.status(409).send(`
    Please send Franchise Name  in json body
    e.g:
    "Name":"Franchise name",
`);
        return;

    } else {

        const newFranchise = new Franchise({
            Name: req.body.Name,
            Number: req.body.Number,
            AtmTime: req.body.AtmTime,
            EndTime: req.body.EndTime,
            Location: req.body.Location,
            StartTime: req.body.StartTime,
            LastIssueNumber: req.body.LastIssueNumber,
            CurrntTokenNumber: req.body.CurrntTokenNumber,
        });

        newFranchise.save().then((data) => {

            res.send(data);

        }).catch((err) => {

            res.status(500).send({
                message: "an error occured : " + err,
            });

        });
    }
});

// get All Franchies 

app.get('/franchise', (req, res, next) => {

    Franchise.find({}, (err, data) => {

        if (!err) {

            res.send(data);

        } else {
            res.status(500).send("error");
        }
    })
})


// get Token Number

app.post("/token", (req, res, next) => {

    var newNumber = 0;

    if (!req.body.FranchiseObjectID) {

        res.status(409).send(`
    Please send IMEI  in json body
    e.g:
    "IMEI":"Mobile IMEI",`);
        return;

    } else {
        Franchise.findById({ _id: req.body.FranchiseObjectID },

            (err, doc) => {

                if (!err) {

                    newNumber = parseInt(doc.CurrntTokenNumber) + 1;
                    doc.CurrntTokenNumber = newNumber;

                    const newToken = new Token({
                        IMEI: req.body.IMEI,
                        TokenNumber: newNumber,
                        Time: req.body.Time,
                        FranchiseObjectID: req.body.FranchiseObjectID
                    })

                    newToken.save()
                    doc.Token.push(newToken)
                    doc.save()
                    res.send(doc)

                    // newToken.save().then((data) => {

                    //     res.send(data);

                    // }).catch((error) => {

                    //     res.status(500).send({
                    //         message: "an error occured : " + error,
                    //     });

                    // });

                } else {
                    res.status(409).send(err)
                }
            })
    }
});

// get All Data FranchiseObjectID in Token number 

app.post('/getTokenNumber', (req, res) => {


    Token.find({ _id: req.body.FranchiseObjectID },

        (err, data) => {
            if (!err) {

                res.send(data);
            }
            else {
                res.status(500).send("error");
            }
        }

    )

})


//delete  Api with Token 

app.delete('/tokenData/:id', (req, res, next) => {

    Token.findByIdAndRemove({ _id: req.params.id }, (err, doc) => {

        if (!err) {
            res.send("Token hase been deleted")
        } else {
            res.status(500).send("error happened")
        }

    })
})






app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});