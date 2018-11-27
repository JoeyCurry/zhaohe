//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    wx.cloud.callFunction({
      name: 'getName',
      data: {}
    }).then((res) => {
      this.globalData = {
        name: res.result.name
      }
    }).catch((err) => {
      this.globalData = {
        name: ''
      }
      console.error('getName', err)
    })
  },

  globalData: {
    openid: '',
    name: ''
  }
})
