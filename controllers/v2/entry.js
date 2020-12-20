import EntryModel from '../../models/v2/entry'


class Entry {
  constructor() {

  }

  async getEntry(req, res, next) {
    try {
      const entries = await EntryModel.find({}, '-_id')
      res.send(entries)
    } catch (err) {
      res.send({
        status: 0,
        type: 'ERROR_DATA',
        message: '获取数据失败'
      })
    }

  }
}
export default new Entry()