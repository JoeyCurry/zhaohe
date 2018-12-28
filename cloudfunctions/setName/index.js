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
    return await db.collection('user').where({
      openId: event.userInfo.openId
    }).update({
      data: {
        name: event.name
      }
    })
  } else {
    return await db.collection('user').add({
      data: {
        openId: event.userInfo.openId,
        name: event.name,
        date: new Date().getTime()
      }
    })
  }
}