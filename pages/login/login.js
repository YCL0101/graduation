//login.js
const app = getApp();
const host = app.globalData.host;
Page({
  data: {
    phoneNumber: "16638267443",
    // passWord: "123456",
    userName: '',
    code: null,
    countdown: '获取验证码'
  },
  onLoad() {},
  phoneNumberInput(e) {
    console.log(e.detail.value);
    this.setData({
      phoneNumber: e.detail.value,
    });
  },
  // passwordInput(e) {
  //   console.log(e.detail.value);
  //   this.setData({
  //     passWord: e.detail.value,
  //   });
  // },
  getCode() {
    const phoneNumber =this.data.phoneNumber;
    // 在发起 wx.request 之前进行手机号和验证码格式的检查
    if (!this.isValidPhoneNumber(phoneNumber)) {
      // 提示用户手机号格式不正确
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      });
      return; 
    }
    // 检查是否正在倒计时，避免重复点击
    if (this.data.countdown > 0) {
      return;
    }
    // 设置倒计时为60秒
    this.setData({
      countdown: 60,
    });
    // 启动定时器，每秒减少一秒
    const timer = setInterval(() => {
      let countdown = this.data.countdown - 1;
      // 更新倒计时
      this.setData({
        countdown: countdown,
      });

      // 检查是否倒计时结束
      if (countdown <= 0) {
        clearInterval(timer); // 倒计时结束，清除定时器
        this.setData({
          countdown: '获取验证码',
        });
      }
    }, 1000);
    // 生成一个范围在 1000 到 9999 之间（包括这两个边界）的随机整数
    const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    this.setData({
      code: code
    })
  },

  login() {
    const phoneNumber =this.data.phoneNumber;
    const code =this.data.code;
    // 在发起 wx.request 之前进行手机号和验证码格式的检查
    if (!this.isValidPhoneNumber(phoneNumber)) {
      // 提示用户手机号格式不正确
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      });
      return; 
    }
    if (!this.isValidCode(code)) {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
      });
      return;
    }
    wx.request({
      url: host + "/login",
      method: "POST",
      header: {
        "content-type": "application/json",
      },
      data: {
        phoneNumber:phoneNumber,
        code:code,
      },
      success: (res) => {
        wx.setStorageSync("personalDetails", res.data.user);
        console.log(res.data.user)
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
  //手机号格式验证函数
  isValidPhoneNumber: function (phoneNumber) {
    // 使用提供的正则表达式验证手机号格式
    const phoneRegex = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[6]|17[0-8]|18[0-9]|19[8,9])\d{8}$/;
    return phoneRegex.test(phoneNumber);
  },
  //检查验证码的函数
  isValidCode: function (code) {
    return code;
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