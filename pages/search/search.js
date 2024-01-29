const app = getApp();
const host = app.globalData.host;
Page({
  data: {
    host:host,
    searchKeyword: '',
    historyList: [], // 搜索历史
    searchResults: [], // 搜索结果
    hotKeywords: [], // 热门搜索关键词
  },
  onInputChange: function (event) {
    // 获取输入框当前值
    const inputValue = event.detail.value;
    // 更新 data 中的 searchKeyword
    this.setData({
      searchKeyword: inputValue,
      searchResults: []
    });

  },
  onLoad: function (options) {
    // 加载本地搜索历史
    const historyList = wx.getStorageSync('historyList') || [];
    this.setData({
      historyList: historyList,
    });
  },

  onSearch: function (e) {
    // console.log(e)
    const keyword = e.detail.value.trim();
    // 获取用户输入的搜索关键字，并通过 trim() 方法删除两端的空白字符
    if (keyword === '') {
      return;
    }
    // 更新搜索历史
    const historyList = this.data.historyList;
    // 检查是否已存在相同的关键词
    const isDuplicate = historyList.includes(keyword);
    // console.log(isDuplicate)

    if (!isDuplicate) {

      // 如果关键词不重复，则添加到搜索历史
      historyList.unshift(keyword);
      // 更新页面数据
      this.setData({
        historyList: historyList,
      });
      // 存储到本地缓存
      wx.setStorageSync('historyList', historyList);
    }
    //搜索请求
    this.searchRequest({
      keyword
    })
  },
  // 请求
  searchRequest(e) {
    // console.log(e)
    const keyword = e.keyword
    wx.request({
      url: host + "/api/searchRequest",
      data: {
        keyword
      },
      success: (res) => {
        // 检查请求是否成功（状态码为200）
        if (res.statusCode === 200) {
          // 处理从 'res.data' 变量中获取的搜索结果
          console.log(res.data.searchResults);
          this.setData({
            searchResults: res.data.searchResults,
          });
          this.userDataPost(); 
        } else {
          // 处理意外的状态码
          console.error('意外的状态码:', res.statusCode);
        }
      },
      fail: (error) => {
        // 处理请求失败
        console.error('搜索请求失败:', error);
      }
    });
  },
  //历史搜索
  onHistoryItemClick: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    // console.log(e)
    this.setData({
      searchKeyword: keyword,
    });
    // 执行搜索操作
    this.onSearch({
      detail: {
        value: keyword
      }
    });
  },
  //热门搜索
  onHotItemClick: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    // console.log(keyword)
    this.setData({
      searchKeyword: keyword,
    });
    // 执行搜索操作
    this.onSearch({
      detail: {
        value: keyword
      }
    });
  },

  // 清除搜索历史
  clearHistory: function () {
    this.setData({
      historyList: [],
    });
    wx.removeStorageSync('historyList');
  }, 
// 从后端获取用户数据
userDataPost() {
  const searchResults = this.data.searchResults;

  // 使用 map 创建新的数组，避免直接修改原始数据
  const promises = searchResults.map(post => {
    return new Promise((resolve, reject) => {
      wx.request({
        url: host + '/api/getUserInfo',
        data: {
          phoneNumber: post.phoneNumber,
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

  Promise.all(promises)
    .then(updatedPosts => {
      // 使用 map 创建新的数组，确保不直接修改原始数据
      const updatedSearchResults = searchResults.map((post, index) => {
        const updatedPost = { ...post, ...updatedPosts[index] };
        return updatedPost;
      });

      this.setData({
        searchResults: updatedSearchResults,
      });
      console.log(this.data.searchResults);
    })
    .catch(error => {
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
}
});