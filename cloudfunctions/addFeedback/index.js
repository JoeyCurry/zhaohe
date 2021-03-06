// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let date = new Date().getTime()
  console.log('date', date)
  return await db.collection('feedback').add({
    data: {
      openId: event.userInfo.openId,
      feedback: event.feedback,
      name: event.name,
      date: date,
      isRead: false,
      time: timestampToTime(date)
    }
  })
}

function timestampToTime(timestamp) {
  if (timestamp) {
    let date = new Date(timestamp + 28800 * 1000);
    console.log('timestampToTime', date)
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = addZero(date.getDate()) + ' ';
    let h = addZero(date.getHours());
    let m = addZero(date.getMinutes()) ;
    let s = addZero(date.getSeconds());
    return Y + M + D + h + ':' + m + ':' + s;
  } else {
    return ''
  }
}

function addZero(val) {
  return val < 10 ? '0' + val : val
}