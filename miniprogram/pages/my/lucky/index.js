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
    wx.cloud.callFunction({
      name: 'getMyLucky',
      data: {}
    }).then(res => {
      console.log(res)
      this.setData({
        myList: res.result.data
      })
    }).catch (e => {
      console.error(e)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})