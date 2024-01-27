Page({
  data: {
    searchKeyword: '',
    historyList: [], // 搜索历史
    searchResults: [], // 搜索结果
    hotKeywords: ['关键词1', '关键词2', '关键词3'], // 热门搜索关键词
  },

  onLoad: function (options) {
    // 加载本地搜索历史
    const historyList = wx.getStorageSync('historyList') || [];
    this.setData({
      historyList: historyList,
    });
  },

  onSearch: function (e) {
    const keyword = e.detail.value.trim();

    if (keyword === '') {
      return;
    }

    // 更新搜索历史
    const historyList = this.data.historyList;
    historyList.unshift(keyword);
    this.setData({
      historyList: historyList,
    });
    wx.setStorageSync('historyList', historyList);

    // 模拟搜索结果
    const searchResults = ['结果1', '结果2', '结果3']; // 你需要根据实际情况获取搜索结果
    this.setData({
      searchKeyword: keyword,
      searchResults: searchResults,
    });
  },

  onHistoryItemClick: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      searchKeyword: keyword,
    });
    // 执行搜索操作
    this.onSearch({ detail: { value: keyword } });
  },

  onHotItemClick: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      searchKeyword: keyword,
    });
    // 执行搜索操作
    this.onSearch({ detail: { value: keyword } });
  },

  // 清除搜索历史
  clearHistory: function () {
    this.setData({
      historyList: [],
    });
    wx.removeStorageSync('historyList');
  },
});
