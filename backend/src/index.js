const express = require("express")
const app = express()
var cors = require("cors")
const { port } = require("./config")

// Permitir cors policy
app.use(cors())

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Rutas
app.use(require("./routes/index"))

// Iniciar API
app.listen(port)

console.log("Servidor ejecutandose en el puerto:", port)
