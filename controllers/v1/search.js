import AddressComponent from '../../prototype/addressComponent'
import Cities from '../../models/v1/cities'
import CityHandle from './cities'
import chalk from 'chalk'



class SearchPlace extends AddressComponent {
  constructor() {
    super()
    this.search = this.search.bind(this)
  }

  async search(req, res, next) {
    const { type = 'search', city_id, keyword } = req.query
    if (!keyword) {
      res.send({
        name: 'ERROR_QUERY_TYPE',
        message: '参数错误',
      })
      return
    } else if (isNaN(city_id / 1)) {
      try {
        const cityname = await CityHandle.getCityName(req)
        const cityInfo = await Cities.cityGuess(cityname)
        city_id = cityInfo.id
      } catch (err) {
        console.error(chalk.red(err))
        console.log('搜索地址时，获取定位城失败')
        res.send({
          name: 'ERROR_GET_POSITION',
          message: '获取数据失败',
        })

      }
    }
    try {
      const cityInfo = await Cities.getCityById(city_id)
      console.log(chalk.red(cityInfo))

      const resObj = await this.searchPlace(keyword, cityInfo.name, type)
      console.log(chalk.red(222))
      console.info(resObj)
      const citylist = resObj.data.reduce((pre, cur) => {
        return [...pre, {
          name: cur.title,
          address: cur.address,
          latitude: cur.location.lat,
          longtitude: cur.location.lng,
          geohash: cur.location.lat + ',' + cur.location.lng
        }]
      }, [])
      res.send(citylist)

    } catch (err) {
      res.send({
        name: 'GET_ADDRESS_ERROR',
        message: '获取地址信息失败1',
      });
    }
  }

}

export default new SearchPlace()