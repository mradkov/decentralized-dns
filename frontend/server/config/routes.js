const controllers = require('../controllers/index')

module.exports = (app) => {
    app.get('/', controllers.home.index)
    app.get('/buy', controllers.user.domainBuy)
    app.get('/price', controllers.user.domainPrice)
    app.get('/ip', controllers.user.domainIP)
    app.get('/renew', controllers.user.domainRenew)
    app.get('/edit', controllers.user.domainEdit)
    app.get('/transfer', controllers.user.domainTransfer)

    app.all('*', (req, res) => {
        res.status(404)
        res.send('404 Not Found!')
        res.end()
    })
}