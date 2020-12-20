import express from 'express'

import Captchas from '../controllers/v1/captchas'
import User from '../controllers/v2/user'
import CityHandle from '../controllers/v1/cities'
import SearchPlace from '../controllers/v1/search'

const router = express.Router()

router.post('/captchas', Captchas.getCaptchas) //登录验证码
router.get('/user', User.getInfo)
router.get('/cities', CityHandle.getCity)
router.get('/cities/:id', CityHandle.getCityById)
router.get('/pois', SearchPlace.search)

export default router