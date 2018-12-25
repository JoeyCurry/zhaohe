// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    await db.collection('luckyImage').where({
      _id: event.id
    }).update({
      data: {
        like: _.inc(-1)
      }
    })
    await db.collection('user').where({
      openId: wxContext.OPENID
    }).update({
      data: {
        like: event.like
      }
    })
    return {}
  } catch (e) {
    console.error(e)
  }
}