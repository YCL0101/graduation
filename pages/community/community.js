const app = getApp();
const host = app.globalData.host;

Page({
  data: {
    host: host,
    postList: [],
    firstId:''
  },

  onLoad: function () {
    // 在页面加载时从后端获取论坛帖子
    this.fetchForumPosts();

  },
  onShow() {

  },
  // 从后端获取论坛帖子数据
  fetchForumPosts: function () {
    // const that = this;

    wx.request({
      url: host + '/api/getForumPosts',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            postList: res.data.posts,
          });
          this.userDataPost(); // 使用箭头函数以保持正确的上下文
        } else {
          console.error('获取论坛帖子数据失败。状态码:', res.statusCode);
        }
      },
      fail: (error) => {
        console.error('获取论坛帖子数据失败:', error);
      },
    });
  },

  // 从后端获取用户数据
  userDataPost() {
    const postList = this.data.postList;

    // 使用 Promise.all 进行批量请求
    const promises = postList.map(post => {
      return new Promise((resolve, reject) => {
        wx.request({
          url: host + '/api/getUserInfo',
          data: {
            userId: post.userId,
          },
          success: (res) => {
            if (res.data.success) {
              const userInfo = res.data.userInfo;
              post.userName = userInfo.userName;
              post.avatarUrl = userInfo.avatarUrl;
              resolve(post);
            } else {
              console.error("获取用户信息失败:", res.data.error);
              reject("获取用户信息失败");
            }
          },
          fail: (error) => {
            console.error("请求用户信息接口失败:", error);
            reject("请求用户信息接口失败");
          },
        });
      });
    });

    // 使用 Promise.all 等待所有请求完成
    Promise.all(promises)
      .then((updatedPosts) => {
        // 所有请求完成后，更新数据
        this.setData({
          postList: updatedPosts,
        });
        console.log(this.data.postList);
      })
      .catch((error) => {
        console.error("处理用户信息请求时出错:", error);
      });
  },

  goDetails(e) {
    // 获取点击项的 id
    const id = e.currentTarget.dataset.id;
    // 从 data 中获取 postList 中的 userName 和 avatarUrl
    const userName = e.currentTarget.dataset.username;
    const avatarUrl = e.currentTarget.dataset.avatarurl;
    // 使用 wx.navigateTo 进行页面跳转，传递 id、userName、avatarUrl 参数
    wx.navigateTo({
      url: '/pages/communityDetails/communityDetails?id=' + id + '&userName=' + userName + '&avatarUrl=' + avatarUrl,
    });
    this.view(id);
  },
  // 观看数
  view(id) {
    console.log("view" + id);
    wx.request({
      url: `${host}/api/view`,
      method: 'POST',
      data: {
        id: id,
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          // 更新数组中相应帖子的观看数字段
          const postIndex = this.data.postList.findIndex(post => post.id === id);
          if (postIndex !== -1) {
            const updatedPostList = [...this.data.postList];
            updatedPostList[postIndex].viewCount = res.data.viewCount; // 假设后端返回的是 viewCount
            this.setData({
              postList: updatedPostList,
            });
          }
        } else {
          console.error('观看失败。状态码:', res.statusCode);
        }
      },
      fail: (error) => {
        console.error('观看请求失败:', error);
      },
    });
  },


  like(e) {
    const id = e.currentTarget.dataset.id;
    const personalDetails = wx.getStorageSync("personalDetails") || {}; // 如果不存在则初始化为空对象
    const userId = personalDetails.id;
    const firstId = this.data.firstId;

    if(id==firstId){
      wx.showToast({
        title: '已点赞！',
        icon:'none'
      })
      return;
    }
    if (!userId) {
      wx.showToast({
        title: '未登录！',
        icon:'error'
      })
      return;
    }
    wx.request({
      url: `${host}/api/likePost`,
      method: 'POST',
      data: {
        id: id,
      },
      success: (res) => {

        if (res.statusCode === 200) {
          this.setData({
            firstId:id
          })
          this.fetchForumPosts();
          wx.showToast({
            title: '点赞成功！',
            icon:'success'
          })
        } else {
          console.error('点赞失败。状态码:', res.statusCode);
        }
      },
      fail: (error) => {
        console.error('点赞请求失败:', error);
      },
    });


  },


  // 下拉刷新事件处理函数
  onPullDownRefresh: function () {
    this.fetchForumPosts();
    // 完成下拉刷新后，调用 wx.stopPullDownRefresh() 来停止刷新动画
    wx.stopPullDownRefresh();
  },

});