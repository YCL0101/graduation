const app = getApp();
const host = app.globalData.host;
Page({
  data: {
    phoneNumber: "16638267443",
    passWord: "123456",
    userName: '',
  },
  phoneNumberInput(e) {
    console.log(e.detail.value);
    this.setData({
      phoneNumber: e.detail.value,
    });
  },
  passwordInput(e) {
    console.log(e.detail.value);
    this.setData({
      passWord: e.detail.value,
    });
  },

  login() {
    wx.request({
      url: host + "/login",
      method: "POST",
      header: {
        "content-type": "application/json",
      },
      data: {
        phoneNumber: this.data.phoneNumber,
        passWord: this.data.passWord,
      },
      success: (res) => {
        wx.setStorageSync("personalDetails", res.data.user);
        // console.log(res.data.user.userLogin)
        console.log(res.data.user.id);
        // 更新全局的userId
        app.globalData.userId=res.data.user.id;
        if (res.data.success) {
          wx.navigateBack({
            delta: 1,
          });
        }
      },
    });
  },
});
