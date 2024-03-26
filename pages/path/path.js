var amapFile = require('../libs/amap-wx.130.js');
Page({
  data: {
    markers: [{
      iconPath: "../image/起点.png",
      id: 0,
      longitude: 116.481028,
      latitude: 39.989643,
      width: 23,
      height: 33
    }, {
      iconPath: "../image/终点.png",
      id: 1,
      longitude: 116.434446,
      latitude: 50.90816,
      width: 24,
      height: 34
    }],
    distance: '',
    cost: '',
    polyline: [], //用于在地图上绘制驾车路线
    pathDetails: [], //路线详情
    location: '', //终点经纬度
    lat:'',
    lng:'',
    endAddress:''
  },
  onLoad: function (e) {
    //获取用户经纬度
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        const origin = longitude + ',' + latitude;

        // 更新markers数组的第一个元素
        this.setData({
          'markers[0].longitude': longitude,
          'markers[0].latitude': latitude
        });

        // 执行getPath函数
        this.getPath(origin);
      },
      fail: (err) => {
        console.error('获取经纬度失败', err);
      }
    });
    //拆分经纬度
    const [longitude, latitude] = e.location.split(',');
    this.setData({
      location: e.location,
      'markers[1].longitude': parseFloat(longitude),
      'markers[1].latitude': parseFloat(latitude),
      lat:parseFloat(latitude),
      lng:parseFloat(longitude),
      endAddress:e.endAddress
    });
  },

  //请求高德数据
  getPath(origin) {
    const location = this.data.location;
    console.log("origin" + origin);
    console.log("location" + location);
    var that = this;
    // var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({
      key: 'fa30e15f69cf95ac691c8d704cc40b73'
    });
    myAmapFun.getDrivingRoute({
      origin: origin,
      destination: location,
      success: function (data) {
        console.log(data.paths[0].steps);
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }],
          pathDetails: data.paths[0].steps
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance / 1000
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }

      },
      fail: function (info) {

      }
    })
  },
  goDetail: function () {
    const pathDetails = this.data.pathDetails;
    wx.navigateTo({
      url: '../pathDetails/pathDetails?pathDetails=' + JSON.stringify(pathDetails),
    });
  },

  //调用腾讯地图导航
  get_button() {
   
    let endPoint = JSON.stringify({ //终点
      'name': this.data.endAddress,
      'location': {
        'lat': this.data.lat,
        'lng': this.data.lng
      }
    })
    console.log(endPoint)
    wx.navigateToMiniProgram({
      appId: 'wx7643d5f831302ab0',
      path: 'pages/multiScheme/multiScheme?endLoc=' + endPoint,
      envVersion: 'release',
      success(res) {
        console.log(res)
      }
    })
  }


})