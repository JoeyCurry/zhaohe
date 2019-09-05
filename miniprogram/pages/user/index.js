// pages/user/index.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '您还未设置名称',
    userId: '您暂无id',
    entryTime: '您暂无加入时间',
    name: '',
    hiddenmodalput: true,
    isAdmin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.name) {
      this.getName()
    } else {
      this.setData({
        userName: app.globalData.name,
        name: app.globalData.name,
        userId: app.globalData.userId || '',
        entryTime: this.timestampToTime(app.globalData.entryDate) 
      })
    }
    this.setData({
      isAdmin: app.globalData.openid === 'oPGrr4tHoWot5sAZ_c36gP7dRpZY'
    })
  },

  showNameModal() {
    this.setData({
      hiddenmodalput: false
    })
  },

  // 输入姓名
  bindNameInput(e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },

  cancel() {
    this.setData({
      hiddenmodalput: true
    })
  },

  // 提交反馈
  confirm() {
    this.setName()
  },

  getName() {
    wx.cloud.callFunction({
      name: 'getName',
      data: {}
    }).then((res) => {
      console.log(res)
      app.globalData.name = res.result.name
      app.globalData.openid = res.result.openid
      this.setData({
        userName: res.result.name || '您还未设置名称',
        name: res.result.name || '您还未设置名称',
        userId: res.result._id || '',
        entryTime: this.timestampToTime(res.result.date)
      })
    }).catch((err) => {
      app.globalData.name = ''
      console.error('getName', err)
    })
  },

  setName() {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'setName',
      data: {
        name: this.data.name
      }
    }).then((res) => {
      let appInstance = getApp()
      appInstance.globalData.name = this.data.name
      wx.hideLoading()
      wx.showToast({
        title: '设置成功',
        duration: 1500
      })
      this.getName()
      this.setData({
        hiddenmodalput: true,
      })
    }).catch((err) => {
      console.error('setName', err)
    })
  },

  goMyFeedback() {
    if (app.globalData.name) {
      wx.navigateTo({
        url: '../my/feedback/index',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.showToast({
        title: '请先设置名称',
        icon: 'none',
        duration: 800
      })
      this.setData({
        hiddenmodalput: false
      })
    }
  },

  goMyLucky() {
    if (app.globalData.name) {
      wx.navigateTo({
        url: '../my/lucky/index',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.showToast({
        title: '请先设置名称',
        icon: 'none',
        duration: 800
      })
      this.setData({
        hiddenmodalput: false
      })
    }
  },

  timestampToTime(timestamp) {
    if (timestamp) {
      let date = new Date(timestamp + 28800 * 1000);
      console.log('timestampToTime', date)
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = this.addZero(date.getDate()) + ' ';
      let h = this.addZero(date.getHours());
      let m = this.addZero(date.getMinutes());
      let s = this.addZero(date.getSeconds());
      return Y + M + D + h + ':' + m + ':' + s;
    } else {
      return '您暂无加入时间'
    }
  },
  addZero(val) {
    return val < 10 ? '0' + val : val
  }

})