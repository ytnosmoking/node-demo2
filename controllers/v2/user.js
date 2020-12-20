

import AddressComponent from '../../prototype/addressComponent'
import chalk from 'chalk'
import UserInfoModel from '../../models/v2/userInfo'
import UserModel from '../../models/v2/user'

import crypto from 'crypto'
import dtime from 'time-formater'
import { UV_FS_O_FILEMAP } from 'constants'

class User extends AddressComponent {
  constructor() {
    super()
    this.login = this.login.bind(this)
  }
  async login(req, res, next) {
    const { cap } = req.cookies
    const { username, password, captcha_code } = req.body

    console.log(chalk.red(`-------`))
    if (!cap) {

      res.send({
        status: 0,
        type: 'ERROR_CAPTCHA',
        message: '验证码失效',
      })
      return
    }
    try {
      if (!username) {
        throw new Error('用户名参数错误')
      }
      if (!password) {
        throw new Error('密码参数错误')
      }
      if (!captcha_code) {
        throw new Error('验证码参数错误')
      }
    } catch (err) {
      res.send({
        status: 0,
        type: 'ERROR_QUERY',
        message: err.message
      })
      return
    }
    if (cap.toString() !== captcha_code.toString()) {
      res.send({
        status: 0,
        type: 'ERROR_CAPTCHA',
        message: '验证码不正确',
      })
      return
    }
    const newpassword = this.encryption(password)
    try {
      const user = await UserModel.findOne({ username })
      console.log(user)
      if (!user) {
        const user_id = await this.getId('user_id')
        const cityInfo = await this.guessPosition(req)
        const registe_time = dtime().format('YYYY-MM-DD HH:mm')
        const newUser = { username, password: newpassword, user_id }
        const newUserInfo = {
          username,
          user_id,
          id: user_id,
          city: cityInfo.city,
          registe_time
        }
        UserModel.create(newUser)
        const userinfo = await new UserInfoModel(newUserInfo).save()
        req.session.user_id = user_id
        res.send(userinfo)
      } else if (user.password.toString() !== newpassword.toString()) {
        console.log('用户登录密码错误')
        res.send({
          status: 0,
          type: 'ERROR_PASSWORD',
          message: '密码错误',
        })
        return
      } else {
        req.session.user_id = user_id
        const userinfo = await UserInfoModel.findOne({ user_id: user.user_id }, '-_id')
        res.send(userinfo)
      }

    } catch (err) {
      console.log(chalk.red(`用户登录失败： `, err))
      res.send({
        status: 0,
        type: 'SAVE_USER_FAILED',
        message: '登录失败'
      })
    }

  }
  // 加密
  encryption(password) {
    return this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password))
  }
  Md5(password) {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }
  async getInfo(req, res, next) {
    const sid = req.session.user_id
    const qid = req.query.user_id
    const user_id = sid || qid
    if (!user_id || !Number(user_id)) {
      res.send({
        status: 0,
        types: 'GET_USER_INFO_FAILED',
        message: '通过session获取用户信息失败'
      })
      return
    }
    try {
      const userinfo = await UserInfoModel.findOne({ user_id }, '-_id')
      res.send(userinfo)
    } catch (err) {
      console.log(chalk.red(err))
      res.send({
        status: 0,
        type: 'GET_USER_INFO_FAILED',
        message: '通过session获取用户信息失败'
      })
    }
  }
}

export default new User()