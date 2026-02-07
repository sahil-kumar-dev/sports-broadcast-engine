import express from 'express'
import matchRouter from './routes/matches'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello World!"
    })
})

app.use('/matches', matchRouter)

app.listen(8000, () => {
    console.log('Server started on port 8000')
})