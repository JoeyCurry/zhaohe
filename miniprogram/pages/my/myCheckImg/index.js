// pages/my/lucky/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myList: [],
    likeImg: '../../../images/good.png',
    likeImgChecked: '../../../images/good_checked.png',
    unlikeImg: '../../../images/bad.png',
    unlikeImgChecked: '../../../images/bad_checked.png',
    waitingImg: '../../../images/waiting.png',
    isFeededImg: '../../../images/ok.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchList()
  },

  fetchList() {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'getUnCheckedImage',
      data: {}
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      this.setData({
        myList: res.result.data
      })
    }).catch(e => {
      console.error(e)
    })
  },

  pass(e) {
    wx.showLoading({
      title: '',
    })
    console.log(e.currentTarget.dataset.id)
    wx.cloud.callFunction({
      name: 'checkImage',
      data: {
        id: e.currentTarget.dataset.id
      }
    }).then(res=> {
      console.log(res)
      this.fetchList()
    }).catch( e => {
      console.error(e)
    })
  },

  deleteImg(e) {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'deleteImage',
      data: {
        id: e.currentTarget.dataset.id
      }
    }).then(res => {
      console.log(res)
      this.fetchList()
    }).catch(e => {
      console.error(e)
    })
  }
})