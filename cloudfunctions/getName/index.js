// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let res = await db.collection('user').where({
    openId: event.userInfo.openId
  }).get()
  if (res.data.length) {
    return res.data[0]
  } else {
    return {
      name: ''
    }
  }
}