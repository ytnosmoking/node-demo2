import mongoose from 'mongoose'
import categoryData from '../../InitData/category'


const Schema = mongoose.Schema

const categorySchema = new Schema({
  count: Number,
  id: Number,
  ids: [],
  image_url: String,
  level: Number,
  name: String,
  sub_categories: [
    {
      count: Number,
      id: Number,
      image_url: String,
      level: Number,
      name: String
    }
  ]
})

categorySchema.statics.addCategory = async function (type) {
  const categoryName = type.split('/')
  try {
    const allcate = await this.findOne()
    const subcate = await this.findOne({ name: categoryName[0] })
    allcate.count++
    subcate.count++
    subcate.sub_categories.map(item => {
      if (item.name === categoryName[1]) {
        return item.count++
      }
    })
    await allcate.save()
    await subcate.save()
    console.log(chalk.green('保存category 成功'))
    return
  } catch (err) {
    console.log(chalk.red('保存category 失败'))
    throw new Error(err)
  }
}
const Category = mongoose.model('Category', categorySchema)

Category.findOne((err, data) => {
  if (!data) {
    Category.create(categoryData)
  }
})

export default Category