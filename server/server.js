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
app.use(express.static('server' + '/uploads'))

app.use("/api/users", require("./routes/usersRoutes"))
app.use("/api/events", require("./routes/eventsRoutes"))

app.use(cors(
    {
        origin: ['even-tease-front.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
))
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`)
})
