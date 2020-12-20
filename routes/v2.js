

import express from 'express'

import User from '../controllers/v2/user'
import CityHandle from '../controllers/v1/cities'
import Entry from '../controllers/v2/entry'
const router = express.Router()


router.post('/login', User.login)
router.get('/pois/:geohash', CityHandle.pois)
router.get('/index_entry', Entry.getEntry)

export default router

