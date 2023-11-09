const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv").config()
const port = process.env.PORT || 5000
const connectDB = require("./config/db")

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/api/users", require("./routes/usersRoutes"))


app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`)
})