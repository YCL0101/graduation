const app = getApp()
const host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bingSearchUrl: '', // 初始化为空
    detailList: [],
    host:host,
  },

  onLoad(options) {
    const ScenicSpotID = options.id;
    // console.log(ScenicSpotID);
    // console.log(1);
    wx.request({
      url: host + '/api/detail?ScenicSpotID=' + ScenicSpotID,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        // console.log(2);
        console.log(res.data.Type);
        const type=res.data.Type;
        this.record(type);
        // 将服务器返回的数据赋值给 detailList 数组
        this.setData({
          detailList: res.data
        });
      },
      fail: function (error) {
        console.error(error);
      }
    })
  },
// 记录用户浏览类型
record(types) {
  const storedUserInfo = wx.getStorageSync("personalDetails");
  const userId = storedUserInfo.id;
  let interestBias = wx.getStorageSync('interestBias') || {
    "自然景区": 0,
    "文化遗址": 0,
    "宗教胜地": 0,
    "风景名胜": 0
  };

  // 检查 types 是否为有效的类型数组
  if (!Array.isArray(types)) {
    console.error('无效的类型数组');
    return;
  }

  // 遍历 types 数组，将对应类型的次数加一
  types.forEach(type => {
    if (type in interestBias) {
      interestBias[type]++;
      console.log(`${type} 次数加一`);
    } else {
      console.error(`无效的类型: ${type}`);
    }
  });

  // 更新本地存储的兴趣偏好
  wx.setStorageSync('interestBias', interestBias);

  wx.request({
    url: `${host}/api/record`,
    method: 'PUT', // 设置为 PUT 请求
    data: {
      userId: userId,
      interestBias: interestBias
    },
    success: function (response) {
      console.log('记录成功', response);
    },
    fail: function (error) {
      console.error('记录失败', error);
    }
  });
},
//景区热度

})