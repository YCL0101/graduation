// pages/userinfo/userinfo.js
const app = getApp();
const host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host:host,
    userinfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userId = options.userId;
    this.getUserinfo(userId);
    console.log(options)
  },
// 通过ID获取用户信息
getUserinfo(userId) {
  wx.request({
    url: host + '/api/getUserInfoById?userId=' + userId,
    success:(res) =>{
      if(res.data.success) {
        this.setData({
          userinfo:res.data.userInfo
        })
        console.log('用户信息:', res.data.userInfo);
      } else {
        console.error('查询失败:', res.data.message);
      }
    },
    fail: function(error) {
      console.error('请求失败:', error);
    }
  });
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})