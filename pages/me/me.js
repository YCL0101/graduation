const app = getApp();
const host = app.globalData.host;
Page({
  data: {
    avatarUrl: '',
    userName: '',
    signature: '', // 个性签名
    host:host,
    id:null
  },
  onShow() {
    const storedUserInfo = wx.getStorageSync("personalDetails");
      console.log(storedUserInfo)
      this.setData({
        id: storedUserInfo.id,
        userName: storedUserInfo.userName,
        signature: storedUserInfo.signature,
        avatarUrl:host + '/headPortrait/' +storedUserInfo.avatarUrl,
      })
  },
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  goPersonalDetails() {
    const storedUserInfo = wx.getStorageSync("personalDetails");
    if (storedUserInfo.id) {
      wx.navigateTo({
        url: '/pages/personalDetails/personalDetails',
      })
    } else {
      wx.showToast({
        title: '请先登录！',
        icon: 'none',
        duration: 2000
      });
    }

  },
  logOut(){
    this.setData({
      id: null,
    });
   // 清除所有本地缓存
  wx.clearStorageSync();
  }
});