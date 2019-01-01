// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    let date = new Date().getTime()
    console.log('date', date)
    return await db.collection('luckyImage').add({
      data: {
        openId: wxContext.OPENID,
        date: date,
        time: timestampToTime(date),
        image: event.image,
        like: 0,
        unlike: 0,
        discussNum: 0,
        discuss: [],
        name: event.name,
        userId: event.userId,
        canPublic: false
      }
    })
  } catch (e) {
    console.error(e)
  }
}

function timestampToTime(timestamp) {
  let date = new Date(timestamp);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = date.getDate() + ' ';
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()   ;
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + ':' + m + ':'+ s;
}