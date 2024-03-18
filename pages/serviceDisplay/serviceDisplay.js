var amapFile = require('../libs/amap-wx.130.js');
// var config = require('../../libs/config.js');

var markersData = [];
Page({
  data: {
    poisData: '',
    keyword:''
  },
  onLoad: function (e) {
    var that = this;
    var key = 'fa30e15f69cf95ac691c8d704cc40b73';

    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    var params = {
      success: function (data) {
        var poisData = data.poisData;
        console.log(poisData)
        that.setData({
          poisData: poisData
        })
      },
      fail: function (info) {}
    }
    params.querykeywords = e.keyword;
    that.setData({
      keyword:e.keyword
    })
    //标题
    wx.setNavigationBarTitle({
      title: e.keyword
    });
    myAmapFun.getPoiAround(params)
  },

})