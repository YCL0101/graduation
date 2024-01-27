const app = getApp();
const host = app.globalData.host;
Page({
  data: {
    // 用户信息
    avatarUrl: '', // 头像地址
    userName: '', // 昵称
    signature: '', // 个性签名
    interests: '', // 兴趣标签
    gender: '', // 性别
    genderOptions: ['男', '女'], // 可选择的性别列表
    selectedGenderIndex: 0, // 默认选择项的索引
    selectedAgeIndex: 0, // 默认选择项的索引
    birthday: '', // 生日
    currentDate: '', // 当前日期
    region: ['', '', ''], // 所在地
  },

  // 选择头像的回调函数
  onChooseAvatar: function (e) {
    const personalDetails = wx.getStorageSync("personalDetails") || []; // 获取缓存数组，如果不存在则初始化为空数组
    const phoneNumber = personalDetails.phoneNumber;
    // 获取选择的头像临时路径
    const {
      avatarUrl
    } = e.detail;

    // 上传头像到后端服务器
    wx.uploadFile({
      url: host + '/upload',
      filePath: avatarUrl,
      name: 'avatar',
      formData: {
        phoneNumber: phoneNumber
      },
      header: {
        'Content-Type': 'multipart/form-data' // 设置正确的 Content-Type
      },
      success: (uploadRes) => {
        const data = JSON.parse(uploadRes.data); // 解析上传成功后的数据
        console.log(data);
        const avatarUrl = host + '/headPortrait/' + data.filename; // 使用正确的属性名
        console.log(avatarUrl);
      
        // 更新页面中的头像显示
        this.setData({
          avatarUrl: avatarUrl
        });
      
        // 更新本地缓存中的 avatarUrl
        const storedUserInfo = wx.getStorageSync("personalDetails") || {};
        wx.setStorageSync("personalDetails", {
          ...storedUserInfo,
          avatarUrl: data.filename
        });
      },
      
      fail: function (uploadError) {
        console.error('头像上传失败');
      }
    });

  },


  // 处理性别选择
  genderChange: function (e) {
    const selectedGenderIndex = e.detail.value;
    this.setData({
      gender: this.data.genderOptions[selectedGenderIndex],
      selectedGenderIndex: selectedGenderIndex,
    });
    console.log(gender); // 打印性别信息
  },

  // 处理生日选择
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    });
  },

  // 处理所在地选择
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    });
  },

  // 输入昵称的事件
  onInputUserName: function (e) {
    console.log(e);
    this.setData({
      userName: e.detail.value
    });
  },

  // 输入个性签名的事件
  onInputSignature: function (e) {
    this.setData({
      signature: e.detail.value
    });
  },

  // 输入兴趣标签的事件
  onInputInterests: function (e) {
    this.setData({
      interests: e.detail.value
    });
  },

  // 保存用户信息到后端
  saveUserInfo: function () {
    // 获取当前页面的个人信息
    const personalDetails = wx.getStorageSync("personalDetails") || []; // 获取缓存数组，如果不存在则初始化为空数组
    const phoneNumber = personalDetails.phoneNumber;
    const userInfo = {
      phoneNumber: phoneNumber,
      userName: this.data.userName,
      signature: this.data.signature,
      interests: this.data.interests,
      gender: this.data.gender,
      birthday: this.data.birthday,
      region: this.data.region
    };

    // 发送网络请求保存个人信息
    wx.request({
      url: host + '/saveUserInfo',
      method: 'POST',
      data: userInfo,
      success: function (res) {
        console.log(res.data);

        // 在这里可以添加一些成功保存后的逻辑
        if (res.data.success) {
          // 更新本地缓存中对应的字段
          const updatedUserInfo = wx.getStorageSync("personalDetails") || {};
          wx.setStorageSync("personalDetails", {
            ...updatedUserInfo,
            userName: userInfo.userName,
            signature: userInfo.signature,
            interests: userInfo.interests,
            gender: userInfo.gender,
            birthday: userInfo.birthday,
            region: userInfo.region
          });

          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function (err) {
        console.error('保存失败', err);
        // 在这里可以添加一些保存失败后的逻辑
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 在页面加载时初始化
  onShow: function () {
    // 获取本地缓存
    const storedUserInfo = wx.getStorageSync("personalDetails");

    // 判断本地缓存是否存在
    if (storedUserInfo) {
      this.setData({
        avatarUrl: host + '/headPortrait/' +storedUserInfo.avatarUrl,
        userName: storedUserInfo.userName || '',
        signature: storedUserInfo.signature || '',
        interests: storedUserInfo.interests || '',
        gender: storedUserInfo.gender || '',
        birthday: storedUserInfo.birthday || '',
        region: storedUserInfo.region || ['', '', ''],
      });
    }

    // 初始化当前日期
    const currentDate = new Date().toISOString().split('T')[0];
    this.setData({
      currentDate: currentDate
    });
  },
});