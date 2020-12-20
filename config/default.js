
module.exports = {
  port: parseInt(process.env.PORT, 10) || 8001,
  url: 'mongodb://localhost:27017/elm1',
  session: {
    name: 'SID',
    secret: 'SID',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  }
}