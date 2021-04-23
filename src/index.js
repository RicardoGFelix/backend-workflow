const app = require('./server')
const port = 3333

app.listen(port, () => { console.log('App listening at http://localhost:${port}')})
