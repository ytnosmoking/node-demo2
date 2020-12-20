
import express from 'express'
import db from './mongodb/db'
import config from 'config-lite'
import router from './routes'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import winston from 'winston'
import expressWinston from 'express-winston'
import history from 'connect-history-api-fallback'
import chalk from 'chalk'
import path from 'path'

var logger = require('morgan');



var app = express();

app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers
  const allowOrign = origin || Origin || referer || Referer || "*"
  res.header('Access-Control-Allow-Origin', allowOrign)
  res.header('Access-Control-Allow-Headers', "Content-Type,Authorization,X-Requested-With")
  res.header('Access-Control-Allow-Methods', "PUT,POST,GET,DELETE,OPTIONS")
  res.header('Access-Control-Allow-Credentials', true) // 可以携带cookies
  res.header('X-Powered-By', "Express")
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

const MongoStore = connectMongo(session)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(session({
  name: config.session.name,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: config.session.cookie,
  store: new MongoStore({
    url: config.url
  })
}))

// 接口请求过来 成功日志
// app.use(expressWinston.logger({
//   transports: [
//     new (winston.transports.Console)({
//       json: true,
//       colorize: true,
//     }),
//     new winston.transports.File({
//       filename: 'logs/success.json'
//     })
//   ]
// }))

router(app)

// app.use(expressWinston.logger({
//   transports: [
//     new winston.transports.Console({
//       json: true,
//       colorize: true
//     }),
//     new winston.transports.File({
//       filename: 'logs/error.json'
//     })
//   ]
// }))

app.use(history())

app.use(express.static(path.join(__dirname, 'public')));

// 静态文件处理

app.listen(config.port, () => {
  console.log(
    chalk.green(`成功监听端口: ${config.port}`)
  )
})


// module.exports = app;
