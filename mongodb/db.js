import mongoose, { mongo } from 'mongoose'
import config from 'config-lite'
import chalk from 'chalk'

//  数据库连接
mongoose.connect(config.url, { useMongoClient: true })

mongoose.Promise = global.Promise

const db = mongoose.connection

db.once('open', () => {
  console.log(
    chalk.green('数据库 连接成功')
  )
})

db.on('error', (error) => {
  chalk.error(
    chalk.red('Error in MongoDB connection: ' + error)
  )
  // mongoose.disconnect()
})

db.on('close', () => {
  console.log(
    chalk.red(`数据库断开，重新连接数据库`)
  )
  mongoose.connect(config.url, { server: { auto_reconnect: true } })
})