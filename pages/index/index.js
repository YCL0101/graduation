// index.js
// 获取应用实例
const app = getApp()
const host = app.globalData.host;
// const key = '50a03a505039735d0e6c3bdf79edf32f';
var amapFile = require('../libs/amap-wx.130.js');

Page({
  data: {
    weatherData: {}, // 获取的天气信息对象
    currentTab: 0, // 当前选项卡索引
    recommendList: [],
    hotList: [],
    host: host,
    historyList: [], // 搜索历史
  },
  // 事件处理函数
  // 点击标题切换滑块
  switchTab: function (e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: parseInt(index)
    });
  },
  // swiper 滑块切换事件处理函数
  tabChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  //周边服务
  rimService() {
    wx.navigateTo({
      url: '../rimService/rimService',
    })
  },
  serviceDisplay: function(e) {
    wx.navigateTo({
      url: '../serviceDisplay/serviceDisplay?keyword=' + e.currentTarget.dataset.type
    });
  },
  onLoad() {
    console.log('页面加载了')
    // 天气
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: 'fa30e15f69cf95ac691c8d704cc40b73' //高德小程序key
    });
    myAmapFun.getWeather({
      success: function (data) {
        console.log(data);
        that.setData({
          weatherData: data
        });
      },
      fail: function (info) {
        that.setData({
          weatherData: null
        });
        console.log(info);
      }
    });
    this.recommendList();
    this.hotList();

  },
  onShow() {

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

  gosearch() {
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

  //景区推荐
  recommendList() {
    const interestBias = wx.getStorageSync('interestBias');
    console.log("景区推荐")
    console.log(interestBias)
    if (interestBias) {
      const sortedInterest = Object.keys(interestBias).sort((a, b) => interestBias[b] - interestBias[a]);
      const keyWord = sortedInterest.slice(0, 1).toString();
      wx.request({
        url: host + '/api/recommend',
        method: 'GET',
        data: {
          interestBias: keyWord
        },
        success: (res) => {
          const recommendList = res.data;
          console.log()
          // 将重新排序后的数据赋值给 recommendList 数组
          this.setData({
            recommendList: recommendList,
          });
        },
        fail: function (error) {
          console.error(error);
        }
      });
    } else {
      wx.request({
        url: host + '/api/hot',
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          this.setData({
            recommendList: res.data
          });
        },
        fail: function (error) {
          console.error(error);
        }
      })
    }

  },

  // 下拉刷新事件处理函数
  onPullDownRefresh: function () {

    this.hotList();
    this.recommendList();
    // 完成下拉刷新后，调用 wx.stopPullDownRefresh() 来停止刷新动画
    wx.stopPullDownRefresh();
  },



})