const express = require('express')
const cookieParser = require('cookie-parser')
const routers = require('./routers/index.router')
const {uploader} = require('./multer')

const app = express()
const PORT = 8080

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/static', express.static(__dirname + '/public'))

app.use("/api", routers)

app.post('/api/products', uploader.single('thumbnail'), (req, res)=>{
    res.status(200).send({
        status: 'success',
        message: 'se subió correctamente'
    })
})

const server = app.listen(PORT, () => {
    console.log(`Listening app port ${server.address().port}`)
});

server.on('error', (error) => {
    console.log('Error', error)
});

