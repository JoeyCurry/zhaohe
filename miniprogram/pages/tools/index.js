// pages/tools/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval:3000,
    duration: 500,
    imgUrls: [
      'cloud://jiangjun-ee2d30.6a69-jiangjun-ee2d30/lucky/luckpic.jpg',
      'cloud://jiangjun-ee2d30.6a69-jiangjun-ee2d30/lucky/luckpic.jpg'
    ],
    grids: [
      {
        image: '../../images/tactic.png',
        label: '攻略合集',
        url: '../tactic/index'
      },
      {
        image: '../../images/get.png',
        label: '奇遇搜索',
        url: '../eventSeach/index'
      },
      {
        image: '../../images/lucky.png',
        label: '寻找欧皇',
        url: '../findLucky/index'
      },
      {
        image: '../../images/family.png',
        label: '敬请期待...',
        url: '',
        toast: '新版本即将来袭，家族图谱即将到来'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
 
  showToast(e) {
    wx.showToast({
      title: e.currentTarget.dataset.toast,
      duration: 3000,
      icon: 'none'
    })
  }
})