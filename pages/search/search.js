const app = getApp();
const host = app.globalData.host;
Page({
  data: {
    host: host,
    searchKeyword: '',
    historyList: [], // 搜索历史
    searchResults: [], // 帖子搜索结果
    hotKeywords: [], // 热门搜索关键词
    scenic:[]//景区搜索结果
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

  },
  onShow() {
    // 加载本地搜索历史
    const historyList = wx.getStorageSync('historyList');
    if (!historyList) {
      this.searchHistory()
    } else {
      this.setData({
        historyList: historyList,
      });
    }
    this.goHotSearch();
  },
  // 请求搜索历史
  searchHistory() {
    const storedUserInfo = wx.getStorageSync("personalDetails");
    const userId = storedUserInfo.id;
    wx.request({
      url: `${host}/api/searchHistory`,
      method: 'GET',
      data: {
        userId: userId
      },
      success: (res) => {
        // 处理请求成功时返回的数据
        if (res.statusCode === 200) {
          console.log('搜索历史数据:', res.data.historyList);
          // 将搜索历史数据存储到页面的某个变量中
          this.setData({
            historyList: res.data.historyList,
          });
          wx.setStorageSync('historyList', res.data.historyList);
        } else {
          console.error('请求搜索历史失败。状态码:', res.statusCode);
        }
      },
      fail: (error) => {
        // 处理请求失败
        console.error('请求搜索历史失败:', error);
      },
    });
  },
  // 请求热门
  goHotSearch() {
    wx.request({
      url: `${host}/api/hotSearch`,
      method: 'GET',
      success: (res) => {
        console.log('Hot search data:', res.data);
        this.setData({
          hotKeywords: res.data.hotSearchData
        })
      },
      fail: (error) => {
        console.error('Request failed:', error);
      }
    });
  },
  //搜索事件
  onSearch: function (e) {
    // console.log(e)
    const keyword = e.detail.value.trim();
    //添加热搜记录
    this.hotSearch(keyword);
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
      const storedUserInfo = wx.getStorageSync("personalDetails");
      // console.log(storedUserInfo)
      const userId = storedUserInfo.id;
      console.log("userId" + userId);
      //搜索历史存储
      wx.request({
        url: `${host}/api/searchHistory`,
        method: 'POST', // 指定请求方法为POST，根据你的后端接口要求而定
        data: {
          userId,
          historyList
        },
        success: (res) => {
          console.log(res);
          // 根据实际情况处理存储成功的逻辑
        },
        fail: (error) => {
          console.error(error);
          // 根据实际情况处理存储失败的逻辑
        }
      });


    }
    //搜索请求
    this.searchRequest({
      keyword
    })
  },
  // 添加热门搜索词
  hotSearch(keyword) {
    if (keyword) {
      wx.request({
        url: `${host}/api/hotSearch`,
        method: 'POST',
        data: {
          keyword: keyword
        },
        success: (res) => {
          if (res.data.success) {
            console.log("添加热门搜索词成功", res);
            // 根据实际情况处理成功的逻辑
          } else {
            console.error("添加热门搜索词失败", res.data.error);
            // 根据实际情况处理失败的逻辑
          }
        },
        fail: (error) => {
          console.error("添加热门搜索词请求失败", error);
          // 根据实际情况处理请求失败的逻辑
        }
      });
    }

  },

  // 请求搜索结果
  searchRequest(e) {
    console.log(e)
    const keyword = e.keyword
    wx.request({
      url: host + "/api/searchRequest",
      method: 'GET',
      data: {
        keyword
      },
      success: (res) => {
        // 检查请求是否成功（状态码为200）
        if (res.statusCode === 200) {
          // 处理从 'res.data' 变量中获取的搜索结果
          console.log(res.data.searchResults);
          console.log(res.data.searchResults.scenic[0]);
          this.setData({
            searchResults: res.data.searchResults.post,//帖子
            scenic:res.data.searchResults.scenic[0]//景区
          });
          this.userDataPost();
        } else {
          wx.showToast({
            title: '不存在！',
            icon: 'none',
            duration: 2000
          })


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
    const storedUserInfo = wx.getStorageSync("personalDetails");
    const userId = storedUserInfo.id;
    this.setData({
      historyList: [],
    });
    wx.removeStorageSync('historyList');
    wx.request({
      url: `${host}/api/deleteSearchHistory?userId=${userId}`,
      method: 'DELETE',
      success: function (res) {},
      fail: function (error) {

      }
    });

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

    Promise.all(promises)
      .then(updatedPosts => {
        // 使用 map 创建新的数组，确保不直接修改原始数据
        const updatedSearchResults = searchResults.map((post, index) => {
          const updatedPost = {
            ...post,
            ...updatedPosts[index]
          };
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
  },
  goScenic(e) {
    var ScenicSpotID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${ScenicSpotID}`,
    });
  },
});