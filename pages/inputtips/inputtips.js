var amapFile = require('../libs/amap-wx.130.js');
var lonlat;
var city;
Page({
  data: {
    tips: {}
  },
  onLoad: function(e){
    lonlat = e.lonlat;
    city = e.city;
  },
  bindInput: function(e){
    var that = this;
    var keywords = e.detail.value; 
    var key = 'fa30e15f69cf95ac691c8d704cc40b73';
    var myAmapFun = new amapFile.AMapWX({key: key});
    myAmapFun.getInputtips({
      keywords: keywords,
      location: lonlat,
      city: city,
      success: function(data){
        if(data && data.tips){
          that.setData({
            tips: data.tips
          });
        }
      }
    })
  },
  bindSearch: function(e){
    var keywords = e.target.dataset.keywords;
    var url = '../rimService/rimService?keywords=' + keywords;
    wx.redirectTo({
      url: url
    })
  }
})