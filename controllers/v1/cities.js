

import Cities from '../../models/v1/cities'
import pinyin from 'pinyin'
import AddressComponent from '../../prototype/addressComponent'
import chalk from 'chalk'


class CityHandle extends AddressComponent {

  constructor() {
    super()
    this.getCity = this.getCity.bind(this)
    this.getCityName = this.getCityName.bind(this)
    this.pois = this.pois.bind(this);
  }

  async getCity(req, res, next) {
    const type = req.query.type
    let cityInfo;
    try {
      switch (type) {
        case 'guess':
          const city = await this.getCityName(req)
          console.log(chalk.red(city))
          cityInfo = await Cities.cityGuess(city)
          break;
        case 'hot':
          cityInfo = await Cities.cityHot();
          break;
        case `group`:
          cityInfo = await Cities.cityGroup();
          break;
        default:
          res.send({
            name: 'ERROR_QUERY_TYPE',
            message: '参数错误',
          })
          return
      }
      res.send(cityInfo)
    } catch (err) {
      console.error(chalk.red(err))
      res.send({
        name: 'ERROR_DATA',
        message: '获取数据失败',
      });
    }
  }

  async getCityById(req, res, next) {
    const cityId = req.params.id
    console.log(req.params)
    if (isNaN(cityId / 1)) {
      res.json({
        name: 'ERROR_PARAM_TYPE',
        message: '参数错误',
      })
      return
    }
    try {
      const cityInfo = await Cities.getCityById(cityId)
      res.send(cityInfo)
    } catch (err) {
      res.json({
        name: 'ERROR_PARAM_TYPE',
        message: '参数错误',
      })
    }
  }

  async getCityName(req, res, next) {
    try {
      const cityInfo = await this.guessPosition(req)

      const pinyinArr = pinyin(cityInfo.city, {
        style: pinyin.STYLE_NORMAL,
      })

      const cityName = pinyinArr.reduce((pre, cur) => {
        return pre + cur
      }, '')
      console.log(chalk.red(cityName))
      return cityName
    } catch (err) {
      console.log(chalk.red(err))
      return `北京`
    }
  }

  async pois(req, res, next) {
    try {
      const geohash = req.params.geohash || ''
      if (geohash.indexOf(',') == -1) {
        res.send({
          status: 0,
          type: 'ERROR_PARAMS',
          message: '参数错误'
        })
        return
      }
      const poisArr = geohash.split(',')
      const { result } = await this.getpois(poisArr[0], poisArr[1])
      const address = {
        addres: result.address,
        city: result.address_component.province,
        geohash,
        latitude: poisArr[0],
        longtitude: poisArr[1],
        name: result.formatted_addresses.recommend
      }
      res.send(address)
    } catch (err) {
      console.log('getpois返回信息失败', err);
      res.send({
        status: 0,
        type: 'ERROR_DATA',
        message: '获取数据失败',
      })
    }
  }


}

export default new CityHandle()