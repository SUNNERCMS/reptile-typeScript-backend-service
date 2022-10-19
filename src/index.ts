import express from 'express';
import router from './router';
import bodyParser from 'body-parser';

const app = express();
const bodyParseMiddleware = bodyParser.urlencoded({ extended: false });

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParseMiddleware);
// app.use(router);

// Series of Middleware
app.use(bodyParseMiddleware, router);

app.listen(7001, () => {
    console.log('server is running');
});