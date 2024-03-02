const app = getApp();
const host = app.globalData.host;

Page({
  data: {
    currentSwiper:0,
    diaries: [],
  },

// 删除按钮点击事件处理函数
deleteDiary: function (event) {
  // 获取笔记 ID
  const id = event.currentTarget.dataset.id;

  // 弹出确认提示框
  wx.showModal({
    title: '提示',
    content: '确定要删除这篇笔记吗？',
    showCancel: true,
    confirmText: '确定',
    confirmColor: '#3CC51F',
    cancelText: '取消',
    cancelColor: '#000000',
    success: (res) => {
      if (res.confirm) {
        // 用户点击了确定按钮，执行删除操作
        // 切换到第一个滑块
        this.setData({
          currentSwiper: 0,
        });

        // 向后端发起删除请求
        wx.request({
          url: host + '/api/deleteNote',
          method: 'POST',
          data: {
            id: id,
          },
          success: (res) => {
            // 删除成功后刷新页面
            if (res.statusCode === 200) {
              this.fetchNotes();
            } else {
              console.error('删除笔记失败。状态码:', res.statusCode);
            }
          },
          fail: (error) => {
            console.error('删除笔记时出错:', error);
          },
        });
      } else if (res.cancel) {
        // 用户点击了取消按钮，不执行删除操作
        console.log('用户取消删除操作');
      }
    },
  });
},


  onLoad: function () {
    // 在页面初次加载时从后端获取笔记
    // this.fetchNotes();
  },

  onShow: function () {
    // 在页面显示时刷新数据
    // console.log(1)
    setTimeout(() => {
      this.fetchNotes();
    }, 100);
  },

  fetchNotes: function () {
    const storedUserInfo = wx.getStorageSync("personalDetails");
    const phoneNumber = storedUserInfo.phoneNumber;

    // 向后端发起请求以获取笔记
    wx.request({
      url: host + '/user/notes',
      method: 'POST',
      data: {
        phoneNumber: phoneNumber
      },
      success: (res) => {
        // 检查请求是否成功
        if (res.statusCode === 200) {
          // 使用从后端获取的笔记更新diaries数据属性
          console.log(res.data.notes)
          this.setData({
            diaries: res.data.notes,
          });
        } else {
          console.error('获取笔记失败。状态码:', res.statusCode);
        }
      },
      fail: (error) => {
        console.error('获取笔记时出错:', error);
      },
    });
  },

  goToDetail: function (event) {
    const id = event.currentTarget.dataset.id;
    // 跳转到日记详情页面
    wx.navigateTo({
      url: '/pages/diaryDetails/diaryDetails?id=' + id,
    });
  },
});