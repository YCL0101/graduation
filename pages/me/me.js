const app = getApp();
const host = app.globalData.host;
Page({
  data: {
    avatarUrl: '',
    userName: '',
    signature: '', // 个性签名
    ifLogin:false,
    host:host
  },
  onShow() {
    const storedUserInfo = wx.getStorageSync("personalDetails");
    if(storedUserInfo.userLogin){
      // console.log(storedUserInfo)
      this.setData({
        ifLogin: storedUserInfo.userLogin,
        userName: storedUserInfo.userName,
        signature: storedUserInfo.signature,
        avatarUrl:host + '/headPortrait/' +storedUserInfo.avatarUrl,
      })
    }
  },
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  goPersonalDetails() {
    const storedUserInfo = wx.getStorageSync("personalDetails");
    this.setData({
      ifLogin: storedUserInfo.userLogin,
    });
    if (storedUserInfo.userLogin) {
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
      ifLogin: false,
    });
    // 更新本地缓存中对应的字段
    const updatedUserInfo = wx.getStorageSync("personalDetails") || {};
    wx.setStorageSync("personalDetails", {
      ...updatedUserInfo,
      userLogin:false
    });
  }
});