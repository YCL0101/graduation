const app = getApp();
const host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    id: null, //帖子id
    postInfo: null, // 用于存放帖子数据
    host: host,
    userName: '',
    avatarUrl: '',
    commentText: "", // 评论输入框的内容
    commentGroup: [] // 评论
  },
  goUserinfo(e) {
    console.log(e.currentTarget.dataset)
   const userId=e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '../userinfo/userinfo?userId='+userId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options.id);
    // console.log(options.userName);
    // console.log(options.avatarUrl);
    // 从 options 中获取 id
    const {
      id,
      userName,
      avatarUrl
    } = options;
    // 更新页面数据
    this.setData({
      id,
      userName,
      avatarUrl
    });
    // 打印帖子的 id
    console.log(id);
    // 根据 id 请求对应帖子的数据
    this.fetchPostData(id);

  },


  //请求帖子数据
  fetchPostData(postId) {
    wx.request({
      url: host + '/api/getPostById',
      data: {
        id: postId,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 请求成功，更新页面数据
          // let commentGroup = this.data.commentGroup; // 获取当前 commentGroup 数组
          // 合并 res.data.postInfo 到 commentGroup
          if (res.data.postInfo.comment) {
            // commentGroup.push(res.data.postInfo.comment);
            this.setData({
              commentGroup: res.data.postInfo.comment
            });
            console.log(res.data.postInfo.comment)
            // console.log(res.data.postInfo.comment[0].children)
          }



          // 更新到小程序的数据
          this.setData({
            postInfo: res.data.postInfo,
            // commentGroup: commentGroup
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

  // 回复评论
  handleMainCommentTap(event) {
    const userName = event.currentTarget.dataset.userName;
    console.log(userName)
    // 设置被点击的用户名和默认文本
    this.setData({
      commentText: `回复 ${userName}: `,
    });
    // 滚动到输入框位置
    wx.pageScrollTo({
      selector: '#input',
      duration: 300,
    });
  },
  // 输入框内容变化时触发
  bindInputComment(e) {
    this.setData({
      commentText: e.detail.value,
    });
  },

  // 点击发布按钮时触发
  publishComment() {
    // 获取用户存储的个人信息
    const storedUserInfo = wx.getStorageSync("personalDetails");

    // 如果用户信息中不存在id，提示用户登录或获取id
    if (!storedUserInfo || !storedUserInfo.id) {
      wx.showToast({
        title: '请先登录!',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 获取帖子id
    const postId = this.data.id;

    // 获取评论文本
    const commentText = this.data.commentText;
    if (!commentText) {
      wx.showToast({
        title: '评论不得为空！',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    // 获取评论组
    const commentGroup = this.data.commentGroup;

    // 获取当前时间
    const currentDateTime = new Date();

    // 获取年份、月份、日期、小时、分钟
    const year = currentDateTime.getFullYear();
    const month = currentDateTime.getMonth() + 1; // 月份从0开始，所以需要加1
    const day = currentDateTime.getDate();
    const hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();

    // 格式化成字符串
    const formattedDateTime = `${year}-${addZero(month)}-${addZero(day)} ${addZero(hours)}:${addZero(minutes)}`;

    console.log(formattedDateTime);

    // 辅助函数：在数字小于10时添加前导零
    function addZero(number) {
      return number < 10 ? `0${number}` : number;
    }

    // 自动赋予一个新的 floor 值
    const newFloor = commentGroup.length + 1;

    // 新增一个评论，并在其 children 数组中添加新的一级评论
    commentGroup.push({
      postId: postId,
      floor: newFloor,
      id: storedUserInfo.id,
      userName: storedUserInfo.userName,
      avatarUrl: storedUserInfo.avatarUrl,
      time: formattedDateTime,
      content: commentText,
      children: [], // 第二级评论数组
    });

    console.log(commentGroup);

    // 更新评论组
    this.setData({
      commentGroup
    });

    // 存储评论
    this.postComment(postId, commentGroup);

    // 清空评论输入框
    this.setData({
      commentText: "",
    });
  },


  // 通过postId发送commentGroup到后端
  postComment(postId, commentGroup) {
    // 使用小程序的wx.request发送请求
    console.log('postId' + postId)
    wx.request({
      url: host + '/api/postComment',
      method: 'POST',
      data: {
        postId: postId,
        commentGroup: commentGroup,
      },
      success: function (res) {
        console.log('评论成功', res.data);
        wx.showToast({
          title: '评论成功!', // 提示的内容
          icon: 'success', // 图标，支持 "success"、"loading" 等
          duration: 2000, // 提示框显示时间，单位毫秒
          mask: true, // 是否显示透明蒙层，防止触摸穿透
        });

      },
      fail: function (err) {
        console.error('评论失败', err);
        // 在这里可以处理请求失败的情况
      }
    });
  },


});