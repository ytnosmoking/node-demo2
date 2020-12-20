import BaseComponent from '../../prototype/baseComponent'
import CategoryModel from '../../models/shopping/category'

class Category extends BaseComponent {
  constructor() {
    super()
  }
  async findById(id) {
    try {
      const CateEntity = await CategoryModel.findOne({ 'sub_categories.id': id })
      let categoName = CateEntity.name
      categoName = CateEntity.sub_categories.reduce((pre, cur) => {
        return pre += '/' + cur.name
      }, categoName)
      return categoName
    } catch (err) {
      console.log(chalk.red('通过category id获取数据失败'))
      throw new Error(err)
    }
  }
}
export default new Category()
