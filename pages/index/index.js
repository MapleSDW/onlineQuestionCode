//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    questionnum:0,
    afternum:0,
    ctNum:0,
    is_login: true,
  },
  onLoad: function () {
    
  },
  onShow:function(){
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      ctNum:0
    })
    this.initStorage();
    //this.getCt();
    
  },
  initStorage:function(t){
    var course = wx.getStorageSync('course');
    //var orderList = wx.getStorageSync('orderlist' + category.id);
    if (course == undefined){
      wx.redirectTo({
        url: '/pages/course/course',
      });
      return
    }
    this.setData({
      courseName: course.name,
    })
  },
  getCt:function(){
    var t = this
    var category = wx.getStorageSync('category');
    wx.getStorage({
      key: 'errorids' + category.id,
      success: function (e) {
        console.log(e)
        for (var a = e.data, i = "", o = 0; o < a.length; o++) a[o][Object.keys(a[o]).toString()].toString() && (i += a[o][Object.keys(a[o]).toString()].toString() + ",");
        console.info("asas", i.slice(0, -1).split(",").length), "" != i ? t.setData({
          ctNum: i.slice(0, -1).split(",").length <= 99 ? i.slice(0, -1).split(",").length : 100
        }) : t.setData({
          ctNum: 0
        });
      },
    })
  },
  getUserInfo: function(e) {
    // console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
    var that = this;
    wx.getUserInfo({
      lang: 'zh_CN',
      success:function (res){
        var userInfo = res.userInfo
        wx.login({
          success:function (res){
            if(res.code){
              userInfo.code = res.code;
              userInfo.spid = app.globalData.spid;
              wx.request({
                url: app.globalData.url + '/routine/login/index',
                method:'post',
                dataType:'json',
                data:{
                  info:userInfo
                },
                success:function(res){
                  console.log(res)
                }
              })
            }
          }
        });
      }
    })
  },
  myQuestion: function () {
    wx.navigateTo({
      url: "../course/course?isFirst=0"
    });
  },
  orderGo: function (t) {
    var that = this;
    var uid = app.globalData.uid;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_setting_value',
      method: 'get',
      dataType: 'json',
      data: {
        uid: uid,
        key: 'useLearn'
      },
      success: function (res) {
        if (res.data.data.value == "true"){
          var e = t.currentTarget.dataset.mode;
          setTimeout(function () {
            // wx.navigateTo({
            //   url: '/pages/moni/moni?mode=' + e,
            // })
            wx.navigateTo({
              url: '/pages/catelist/catelist?mode=' + e + '&action=question',
            })
          }, 30)
        }else{
          wx.showToast({
            title: '练习模式未开启',
            icon: 'loading'
          })
        }
      }
    })
    
  },
  defaultGo:function(t){
    // var e = this;
    // "0" == t.currentTarget.dataset.ind ? (setTimeout(function () {
    //   wx.navigateTo({
    //     url: "../errorpage/errorpage?ids=" + JSON.stringify(e.data.orderids),
    //   })
    // }, 30), getApp().sectionList = JSON.stringify(this.data.orderids)) : setTimeout(function () {
    //     wx.navigateTo({
    //       url: "../collecpage/collecpage?ids=" + JSON.stringify(e.data.orderids)
    //     });
    // }, 30)
    console.log( "../eorclist/eorclist?ind=" + t.currentTarget.dataset.ind);
    wx.navigateTo({
      url: "../eorclist/eorclist?ind=" + t.currentTarget.dataset.ind
    })
  },
  examGo: function () {
    var that = this;
    if (this.data.userInfo.avatarUrl == undefined || this.data.userInfo.avatarUrl == '') {
      this.login();
      return
    }
    var uid = app.globalData.uid;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_setting_value',
      method: 'get',
      dataType: 'json',
      data: {
        uid: uid,
        key: 'checkUser'
      },
      success: function (res) {
        let checkUser = false;
        if (res.data.data.value == "true")
          checkUser = true
        if (checkUser) {
          let userInfo = that.data.userInfo;
          console.log(userInfo)
          if (userInfo.status == 2) {
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/catelist/catelist?mode=0' + '&action=exam',
              })
            }, 30)
          } else if (userInfo.status == 1) {
            wx.navigateTo({
              url: '../status/status',
            })
          } else {
            wx.navigateTo({
              url: '../register/register',
            })
          }
        } else {
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/catelist/catelist?mode=0' + '&action=exam',
            })
          }, 30)
        }
      }
    })
    
  },
  gradeGo: function () {
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/grade/grade"
      });
    }, 30);
  },
  headerMenu: function () {
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/catelist/catelist?mode=0' + '&action=rank',
      });
    }, 30);
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
                  wx.setStorageSync('userInfo', res.data.data);
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
})
