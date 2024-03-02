// index.js
// 获取应用实例
const app = getApp()
const host = app.globalData.host;
const key = '50a03a505039735d0e6c3bdf79edf32f';
Page({
  data: {
    recommendList: [],
    hotList: [],
    host: host,
    historyList: [], // 搜索历史
    weather: [],
  },
  // 事件处理函数
  onLoad() {
    console.log('页面加载了')
    // this.recommendList();
    this.hotList();

  },
  onShow() {
    this.recommendList();
    this.getUserLocation();
    //示例
    // this.weather()
  },
  //景区
  hotList() {
    wx.request({
      url: host + '/api/hot', // 请求的地址
      method: 'GET', // 请求方法
      header: {
        'content-type': 'application/json' // 请求头
      },
      success: (res) => {
        // 使用箭头函数，在回调函数内部可以直接访问外部作用域的变量
        console.log(res.data); // 输出服务器返回的数据
        // 将服务器返回的数据赋值给 imageList 数组
        this.setData({
          hotList: res.data
        });
      },
      fail: function (error) {
        // 请求失败时的回调函数
        console.error(error);
      }
    })
  },

  gosearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  godetail(e) {
    var ScenicSpotID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${ScenicSpotID}`,
    });
  },

//推荐
  recommendList() {
    const interestBias = wx.getStorageSync('interestBias');
    const sortedInterest = Object.keys(interestBias).sort((a, b) => interestBias[b] - interestBias[a]);
    const keyWord = sortedInterest.slice(0, 1).toString();

  // console.log(keyWord)
    wx.request({
      url: host + '/api/recommend',
      method: 'GET',
      data: {
        interestBias: keyWord
      },
      success: (res) => {
        const recommendList = res.data;
        // 将重新排序后的数据赋值给 recommendList 数组
        this.setData({
          recommendList: recommendList,
        });
      },
      fail: function (error) {
        console.error(error);
      }
    });
  },
  
  // 获取用户的定位信息
  getUserLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => { // 使用箭头函数
        // 获取用户经纬度
        const latitude = res.latitude;
        const longitude = res.longitude;

        // 调用逆地理编码的服务，获取城市信息
        wx.request({
          url: `https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${longitude},${latitude}`,
          method: 'GET',
          success: (result) => { // 使用箭头函数
            const cityCode = result.data.regeocode.addressComponent.adcode;
            console.log('用户所在城市编码：', cityCode);

            // 获取城市编码后调用天气查询函数
            this.weather(cityCode);
          },
          fail: (error) => { // 使用箭头函数
            console.error('获取城市信息失败', error);
          }
        });
      },
      fail: (error) => { // 使用箭头函数
        console.error('获取定位信息失败', error);
      }
    });
  },

  // 天气查询函数
  weather(cityCode) {
    // const cityCode = '410221';
    // 调用高德地图的天气查询 API
    wx.request({
      url: `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${cityCode}&extensions=all`,
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
  }



})