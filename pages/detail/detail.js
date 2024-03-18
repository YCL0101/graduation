const app = getApp()
const host = app.globalData.host;
const key = '50a03a505039735d0e6c3bdf79edf32f';//高德web服务key
// var amapFile = require('../libs/amap-wx.130.js');
Page({
  data: {
    bingSearchUrl: '', // 初始化为空
    detailList: [],
    host: host,
    weather: {}, //天气
    location: '' //经纬度
  },

  onLoad(options) {

    const ScenicSpotID = options.id;
    // console.log(ScenicSpotID);
    this.getDetail(ScenicSpotID);

  },
  //请求景点详情
  getDetail(ScenicSpotID) {
    wx.request({
      url: host + '/api/detail?ScenicSpotID=' + ScenicSpotID,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        // console.log(2);
        console.log(res.data);
        const type = res.data.Type;
        this.record(type);
        // 将服务器返回的数据赋值给 detailList 数组
        this.setData({
          detailList: res.data
        });
        const address = res.data.CityName + res.data.ScenicSpotName;
        console.log(address);
        this.getcityCode(address);
      },
      fail: function (error) {
        console.error(error);
      }
    })
  },
  // 区域地理编码
  getcityCode(address) {
    wx.request({
      url: `https://restapi.amap.com/v3/geocode/geo?address=${address}&output=JSON&key=${key}`,
      method: 'GET',
      success: (result) => { // 使用箭头函数
        const adcode = result.data.geocodes[0].adcode;
        console.log(result);
        console.log(address + adcode);
        this.weather(adcode);
        this.setData({
          location: result.data.geocodes[0].location
        })
      },
      fail: (error) => { // 使用箭头函数
        console.error(error);
      }
    });
  },
  // 天气查询函数
  weather(adcode) {
    // const cityCode = '410221';
    // 调用高德地图的天气查询 API
    wx.request({
      url: `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${adcode}&extensions=all`,
      method: 'GET',
      success: (result) => { // 使用箭头函数
        console.log(result.data.forecasts[0]);
        this.setData({
          weather: result.data.forecasts[0]
        })
        // 在这里处理天气信息，更新你的小程序界面
      },
      fail: (error) => { // 使用箭头函数
        console.error('获取天气信息失败', error);
      }
    });
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
  //路线规划
  goPath() {
    const location = this.data.location;
    const endAddress = this.data.detailList.ScenicSpotName;
    wx.navigateTo({
      url: '../path/path?location=' + location+'&endAddress='+endAddress,
    })
  },
  //虚拟漫游
  goRoam(e) {
    // console.log(e.currentTarget.dataset.roamurl);
    // decodeURIComponent 是 JavaScript 中的一个全局函数，用于解码由 encodeURIComponent 编码的 URI 组件。在 Web 开发中，它通常用于处理包含特殊字符或被编码的 URI 字符串。
    const roamurl = encodeURIComponent(e.currentTarget.dataset.roamurl);
    wx.navigateTo({
      url: '../roam/roam?roamurl=' + roamurl,
    })
  },
  //AI问答
  goAI(){
    wx.navigateTo({
      url: '../ai/ai',
    })
  },
})