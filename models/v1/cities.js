import mongoose from 'mongoose'
import cityData from '../../InitData/cities'

import chalk from 'chalk'



const citySchema = new mongoose.Schema({
  data: {}
})


citySchema.statics.cityGuess = function (name) {
  return new Promise(async (resolve, reject) => {
    const firstWord = name.substr(0, 1).toUpperCase()
    try {
      const city = await this.findOne()
      Object.entries(cityData).forEach(item => {
        if (item[0] == firstWord) {
          item[1].forEach(cityItem => {
            if (cityItem.pinyin == name) {
              resolve(cityItem)
            }
          })
        }
      })
    } catch (err) {
      reject({
        name: 'ERROR_DATA',
        message: '查找数据失败'
      })
      console.error(chalk.red(err))
    }
  })
}

citySchema.statics.cityHot = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const city = await this.findOne()
      resolve(city.data.hotCities)
    } catch (err) {
      console.error(chalk.red(err))
      reject({
        name: 'ERROR_DATA',
        message: '查找数据失败'
      })
    }
  })
}

citySchema.statics.cityGroup = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const city = await this.findOne()
      const cityObj = city.data
      resolve({
        ...cityObj,
        _id: '',
        hotCities: []
      })
    } catch (err) {
      console.error(chalk.red(err))
      reject({
        name: 'ERROR_DATA',
        message: '查找数据失败',
      });
    }
  })
}

citySchema.statics.getCityById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const city = await this.findOne()
      Object.entries(city.data).forEach(item => {
        if (item[0] !== `_id` && item[0] !== 'hotCities') {
          item[1].forEach(cityItem => {
            if (cityItem.id == id) {
              resolve(cityItem)
            }
          })
        }
      })

    } catch (err) {
      console.error(chalk.red(err))
      reject({
        name: 'ERROR_DATA',
        message: '查找数据失败',
      });
    }
  })
}






const Cities = mongoose.model('Cities', citySchema)

Cities.findOne((err, data) => {
  if (!data) {
    Cities.create({ data: cityData })
  }
})

export default Cities