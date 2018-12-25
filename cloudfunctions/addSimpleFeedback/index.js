// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('feedback').add({
    data: {
      openId: event.userInfo.openId,
      feedback: event.feedback,
      name: event.name,
      title: event.title,
      eventId: event.id,
      date: new Date().getTime() + 28800 * 1000
    }
  })
}