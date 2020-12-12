const express = require('express');
const next = require('next');

require('dotenv').config()

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()

    server.get('/posts', (req, res) => {
        return app.render(req, res, '/posts', req.query)
    })

    server.get('/b', (req, res) => {
        return app.render(req, res, '/b', req.query)
    })

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})


// заглушка
export default {}