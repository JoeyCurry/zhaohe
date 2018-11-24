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
          let appInstance = getApp()
          this.setData({
            id: options.id,
            eventData: res.data,
            name: appInstance.globalData.name
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

  // 打开反馈
  feedback() {
    let appInstance = getApp()
    this.setData({
      hiddenmodalput: false,
      name: appInstance.globalData.name
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
    if (!this.data.name.trim()) {
      wx.showToast({
        title: '请填写名称',
        icon: 'none',
        duration: 1500
      })
    } else if (!this.data.feedback.trim()) {
      wx.showToast({
        title: '请添加反馈',
        icon: 'none',
        duration: 1500
      })
    } else {
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
    }
  },

  setName() {
    wx.cloud.callFunction({
      name: 'setName',
      data: {
        name: this.data.name
      }
    }).then((res) => {
      let appInstance = getApp()
      appInstance.globalData.name = this.data.name
      wx.showToast({
        title: '反馈成功',
        icon: 'success',
        duration: 1500
      })
      this.setData({
        hiddenmodalput: true
      })
    }).catch((err) => {
      console.error('setName', err)
    })
  },

})