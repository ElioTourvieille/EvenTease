const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv").config()
const port = process.env.PORT || 5000
const connectDB = require("./config/db")
const cors = require("cors")
const fileUpload = require("express-fileupload");

connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(fileUpload({ createParentPath: true }))
app.use(express.static('server' + '/picturesFolder'))

app.use("/api/users", require("./routes/usersRoutes"))
app.use("/api/events", require("./routes/eventsRoutes"))
app.post('/api/events/:id/participate', (req, res) => {
    console.log('Received participate request for event ID:', req.params.eventId);
});

app.use(cors())
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`)
})
