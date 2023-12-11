const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv").config()
const port = process.env.PORT || 5000
const connectDB = require("./config/db")
const cors = require("cors")
const multer = require('multer');

connectDB()

const app = express()

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, './Files') // Folder where we want to upload the files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`) // Define the file name
    },
});

//Use Multer to configure the upload
const upload = multer({storage})

app.post('/upload', upload.single('file'), (req, res) => {
    console.log('Received file:', req.file);
    console.log(req.file);
})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/api/users", require("./routes/usersRoutes"))
app.use("/api/events", require("./routes/eventsRoutes"))
app.post('/api/events/:id/participate', (req, res) => {
    console.log('Received participate request for event ID:', req.params.eventId);
});

app.use(cors())
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`)
})
