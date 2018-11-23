// pages/eventDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    eventData: {},
    hiddenmodalput: true,
    name: '',
    feedback: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.fetchDetail()
    wx.showLoading({
      title: 'loading',
    })
    const db = wx.cloud.database()
    db.collection('event').doc(options.id).get({
      success: res => {
        // res.data 包含该记录的数据
        try {
          this.getName()
          this.setData({
            id: options.id,
            eventData: res.data
          })
          wx.hideLoading()
        } catch (e) {
          console.error(e)
        }
        console.log(res.data)
      },
      fail: (e) => {
        console.error(e)
      }
    })
  },

  feedback() {
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

  bindFeedback(e) {
    this.setData({
      feedback: e.detail.value.trim()
    })
  },

  cancel() {
    this.setData({
      hiddenmodalput: true
    })
  },

  // 提交反馈
  confirm() {
    wx.showToast({
      title: '反馈中...',
      icon: 'loading',
    })
    wx.cloud.callFunction({
      name: 'addSimpleFeedback',
      data: {
        feedback: this.data.feedback,
        name: this.data.name,
        id: this.data.eventData._id,
        title: this.data.eventData.title,
      }
    }).then((res) => {
      this.setName()
    })
  },

  setName() {
    wx.cloud.callFunction({
      name: 'setName',
      data: {
        name: this.data.name
      }
    }).then((res) => {
      this.setData({
        hiddenmodalput: true
      })
      wx.showToast({
        title: '反馈成功',
        icon: 'success',
        duration: 1500
      })
    }).catch((err) => {
      console.error('setName', err)
    })
  },

  getName() {
    wx.cloud.callFunction({
      name: 'getName',
      data: {}
    }).then((res) => {
      this.setData({
        name: res.result.name
      })
    }).catch((err) => {
      console.error('getName', err)
    })
  }
})