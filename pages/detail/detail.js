const app = getApp()
const host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
        console.log(res.data);
  
        // 将服务器返回的数据赋值给 detailList 数组
        this.setData({
          detailList: res.data
        });
      },
      fail: function (error) {
        console.error(error);
      }
    })
  }

})