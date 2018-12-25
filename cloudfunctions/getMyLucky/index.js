// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('luckyImage').where({
    openId: wxContext.OPENID
  }).get()
  // let myInfo = await db.collection('user').where({
  //   openId: wxContext.OPENID
  // }).get()
  // let myLikeIds = myInfo.data.like

  // let myLike = await db.collection('luckyImage').where({
    
  // })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}