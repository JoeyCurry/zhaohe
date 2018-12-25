// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const total = await db.collection('luckyImage').where({
    canPublic: true
  }).count()
  console.log('total', total)
  let pageNum = event.pageNum
  let pageCount = event.pageCount || 20
  let totalPageNum = Math.ceil(total.total / pageCount)
  if (pageNum > totalPageNum) {
    return {
      list: [],
      pageNum,
      totalPageNum
    }
  } else {
    let list = []
    list = await db.collection('luckyImage').where({
      canPublic: true
    }).orderBy('date', 'desc').skip((pageNum - 1) * pageCount)
      .limit(pageCount).get()
    return {
      list,
      pageNum,
      totalPageNum,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
  }

}