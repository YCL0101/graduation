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
        // console.log(res.data.user.id);

        const userId = res.data.user.id;
        this.getrecord(userId);
        if (res.data.success) {
          wx.navigateBack({
            delta: 1,
          });
        }
      },
    });
  },
  getrecord(userId) {
    // 获取个人浏览记录数据
    wx.request({
      url: `${host}/api/record`,
      method: 'GET',
      data: {
        userId: userId
      },
      success: function (response) {
        wx.setStorageSync('historyList', response.data.history);
        wx.setStorageSync('interestBias', response.data.interestBias);
        console.log('个人浏览记录数据：', response);
      },
      fail: function (error) {
        console.error('获取个人浏览记录数据失败', error);
      }
    });
  }

});