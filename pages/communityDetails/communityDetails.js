const app = getApp();
const host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postInfo: null, // 用于存放帖子数据
    host:host,
    userName:'',
    avatarUrl:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id);
    console.log(options.userName);
    console.log(options.avatarUrl);
    // 从 options 中获取 id
    const { id, userName, avatarUrl } = options;
  
    // 更新页面数据
    this.setData({
      userName,
      avatarUrl
    });
  
    // 打印帖子的 id
    console.log(id);
  
    // 根据 id 请求对应帖子的数据
    this.fetchPostData(id);
  },
  

  // 自定义函数，用于请求帖子数据
  fetchPostData(postId) {
    // 在这里进行请求数据的操作，你可以使用 wx.request 或其他方式
    // 例如：
    wx.request({
      url:host+'/api/getPostById',
      data: {
        id: postId,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 请求成功，更新页面数据
          this.setData({
            postInfo: res.data.postInfo, // 假设接口返回的数据包含在 post 字段中
          });
          console.log(res.data.postInfo)
        } else {
          console.error('请求帖子数据失败。状态码:', res.statusCode);
        }
      },
      fail: (error) => {
        console.error('请求帖子数据时出错:', error);
      },
    });
  },


});
