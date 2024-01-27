// index.js
// 获取应用实例
const app = getApp()
const host = app.globalData.host;
Page({
  data: {
    imageList: [],
    reMenImageList: [],
    host: host
  },
  // 事件处理函数
  onLoad() {
    console.log('页面加载了')
    this.getreMenImageList()
  },
  onShow(){
    this.getreMenImageList()
  },
  getreMenImageList(){
 wx.request({
      url: host+'/api/tuijian', // 请求的地址
      method: 'GET', // 请求方法
      header: {
        'content-type': 'application/json' // 请求头
      },
      success: (res) => {
        // 使用箭头函数，在回调函数内部可以直接访问外部作用域的变量
        console.log(res.data); // 输出服务器返回的数据
        // 将服务器返回的数据赋值给 imageList 数组
        this.setData({
          imageList: res.data,
          reMenImageList: res.data
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
  }
  
})