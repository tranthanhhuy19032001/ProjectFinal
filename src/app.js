const express = require('express');
const path = require('path');
const app = express();
const route = require('./routes/index');
const db = require('./config/db/index');
const { engine } = require('express-handlebars');
const port = 3000;
const morgan = require('morgan');
const env = require('dotenv');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

db.connect();

app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'));
console.log("11111111111111111111")
    // HTTP logger
app.use(morgan('combined'));
app.use(cookieParser());


// app.use(
//   cookieSession({
//     name: 'session',
//     keys: ['secret'],
//     maxAge: 60 * 60,
//   }),
// );

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

app.use(methodOverride('_method'));

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
        },
    }),
);
app.set('view engine', 'hbs');
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.set('views', path.join(__dirname, 'resources/views'));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});