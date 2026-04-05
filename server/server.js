require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const errorHandler = require('./middleware/errorMiddleware')
const helmet = require("helmet")


const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try{
        await connectDB()
        app.listen(PORT, () => {
            console.log(`SERVER CONNECTED SUCCESSFULLYY.... AT PORT ${PORT}`)
        })
    }catch(err) {
        console.error(err)
        process.exit(1)
    }
}

startServer()
