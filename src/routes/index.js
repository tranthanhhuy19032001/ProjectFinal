const homeRoutes = require('./HomeRoutes');
const userRotes = require('./UserRoutes');

function route(app) {

    app.use('/', homeRoutes);

    app.use('/user', userRotes);
}

module.exports = route;