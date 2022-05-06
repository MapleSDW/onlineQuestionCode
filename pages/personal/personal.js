var app = getApp();
var e = [{
  icon: "http://file.xiaomutong.com.cn/e2c738a74048b4fa801ccf82800a8c8e.png",
  title: "热度排名",
  msg: "",
  showRight: 1
},{
  icon: "http://file.xiaomutong.com.cn/e2c738a74048b4fa801ccf82800a8c8e.png",
  title: "我的成绩",
  msg: "",
  showRight: 1
},{
  icon: "http://file.xiaomutong.com.cn/icon_center_tj.png",
  title: "分享好友",
  msg: "",
  showRight: 1
}, {
  icon: "http://file.xiaomutong.com.cn/icon_center_msg.png",
  title: "意见反馈",
  msg: "",
  showRight: 1
}, {
  icon: "http://file.xiaomutong.com.cn/icon_center_download.png",
  title: "关于我们",
  msg: "",
  showRight: 1
}];

Page({
  data: {
    cellList: e,
    userInfo: {},
    is_login: true
  },
  onLoad: function (e) {
  },
  onShow: function () {
    var a = this;
    wx.getUserInfo({
      success: function (t) {
        a.setData({
          userInfo: {
            nickName: t.userInfo.nickName,
            avatarUrl: t.userInfo.avatarUrl || "https://picture.eclicks.cn/kaojiazhao/public/wx_xcx/default/gungun.png"
          }
        })
      }
    });
  },
  go_view: function (e) {
    switch (1 * e.currentTarget.dataset.viewind) {
      case 0:
        wx.navigateTo({
          url: '../hot/hot',
        })
        break;
      case 1:
        if (this.data.userInfo.avatarUrl == undefined || this.data.userInfo.avatarUrl == '') {
          this.login()
          return
        }
        wx.navigateTo({
          url: '/pages/catelist/catelist?mode=0' + '&action=history',
        })
        break;
      case 2:
        break;
      case 3:
        if (this.data.userInfo.avatarUrl == undefined || this.data.userInfo.avatarUrl == '') {
          this.login()
          return
        }
        wx.navigateTo({
          url: '../feedback/feedback',
        })
        break;
      case 4:
        this.about()
        break;
    }
  },
  about() {
    wx.showModal({
      title: '关于我们',
      content: '本程序仅供考试学习使用，请勿使用于商业用途，如有问题，请联系QQ：903363777、微信：kossfirst。',
      showCancel: false
    })
  },
  onShareAppMessage: function () {
    return {
      title: "答题助手 ！",
      path: "pages/start/start",
      imageUrl: "https://bmob-cdn-24471.bmobcloud.com/2019/07/11/9353ef0240fb00bc800956b373ee92e5.png"
    };
  },
  login() {
    this.setData({
      is_login: !this.data.is_login
    })
  },
  bindgetuserinfo: function (e) {
    this.login()
    
    var that = this;
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        wx.showLoading({
          title: '授权中',
        })
        var userInfo = res.userInfo
        wx.login({
          success: function (res) {
            if (res.code) {
              userInfo.code = res.code;
              userInfo.spid = app.globalData.spid;
              wx.request({
                url: app.globalData.url + '/routine/login/index',
                method: 'post',
                dataType: 'json',
                data: {
                  info: userInfo
                },
                success: function (res) {
                  wx.hideLoading();
                  console.log(res)
                  wx.setStorageSync('uid', res.data.data.uid);
                  app.globalData.uid = res.data.data.uid;
                  app.globalData.openid = res.data.data.routine_openid;
                  wx.setStorageSync('userInfo',res.data.data);
                  that.setData({
                    userInfo: res.data.data
                  });
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
              wx.hideLoading();
            }
          }
        });
      }
    })
  },
});