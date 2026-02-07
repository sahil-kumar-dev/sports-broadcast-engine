import express from 'express'
import matchRouter from './routes/matches'
import http from 'http'
import { attachWebSocketServer } from './ws/server'

const PORT = parseInt(process.env.PORT || '8080', 10)
const HOST = process.env.HOST || '0.0.0.0'
const app = express()

const server = http.createServer(app)
const { broadcastMatchCreated } = attachWebSocketServer(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello World!"
    })
})

app.use('/matches', matchRouter)
app.locals.broadcastMatchCreated = broadcastMatchCreated

server.listen(PORT, HOST, () => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`
    console.log(`Server started on port ${baseUrl}`)
    console.log(`WebSocket server started on port ${baseUrl.replace('http', 'ws')}/ws`)
})