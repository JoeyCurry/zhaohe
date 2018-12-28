// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('feedback').where({
    _id: event.id
  }).update({
    data: {
      isRead: true,
      res: event.feedback
    }
  })
}