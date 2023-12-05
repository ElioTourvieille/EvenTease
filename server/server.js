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
        cb(null, 'uploads/') // Folder where we want to upload the files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname) // Define the file name
    },
});

//Use "multer" to configure the upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // We are allowing only 5 MB files
    }
})

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('Fichier téléchargé avec succès')
})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/api/users", require("./routes/usersRoutes"))
app.use("/api/events", require("./routes/eventsRoutes"))

app.use(cors())
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`)
})
