// pages/category/category.js
let app = getApp();
let question = require('../../utils/question.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedCourse: '',
    cateList: [],
    cattext: '',
    loading: 1,
    storageCourse: '',
    is_login: true,
    current: '',
    searchVal: '',
    checkCourse: false
  },

  onLoad: function (e) {
    let that = this;
    console.log('uid');
    console.log(app.globalData.uid);
    let uid = app.globalData.uid;
    let storageCourse = wx.getStorageSync('course');
    that.setData({
      uid: uid,
      storageCourse: storageCourse == '' ? '' : storageCourse.id,
      userInfo: wx.getStorageSync('userInfo')
    })
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_course_list',
      method: 'get',
      dataType: 'json',
      data: {
        uid: uid,
      },
      success: function (res) {
        that.setData({
          courseList: res.data.data,
          loading: !1
        })
        if (!storageCourse) {
          // var category = { 'id': res.data.data[0].id, 'name': res.data.data[0].name,'number':res.data.data[0].number,'time':res.data.data[0].time,'passf':res.data.data[0].passf}
          // wx.setStorageSync('category', category)
          // that.setData({
          //   selectedCate: res.data.data[0].id
          // })
        } else {
          that.setData({
            selectedCourse: storageCourse.id
          })
          // for (var i = 0; i < that.data.courseList.length; i++) {
          //   if (that.data.courseList[i].id == storageCourse.id) {
          //     console.log(that.data.courseList[i])
          //     that.setData({
          //       selectedCourse: that.data.courseList[i].id,
          //       selectedCourseName: that.data.courseList[i].name,
          //       current: that.data.courseList[i].name,
          //     })
          //     break
          //   }
          // }
        }
        // that.startInit()
      }
    });
  },

  onReady: function () {

  },

  onShow: function () {

  },
  cardSelect: function (t) {
    this.setData({
      selectedCourse: t.currentTarget.dataset.courseid,
      selectedCourseName: t.currentTarget.dataset.name,
    })
    this.startInit()
    console.log(this.data.storageCourse);
    if (this.data.storageCourse == '') {
      var course = { 'id': t.currentTarget.dataset.courseid, 'name': t.currentTarget.dataset.name }
      wx.setStorageSync('course', course)
    }
  },

  startInit: function () {
    // var that = this;
    // that.setData({
    //   loading: !0
    // })
    // wx.request({
    //   url: app.globalData.url + '/routine/auth_api/get_question_count',
    //   method: 'get',
    //   dataType: 'json',
    //   data: {
    //     uid: that.data.uid,
    //     courseid: that.data.selectedCourse
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     wx.hideLoading();
    //     setTimeout(function () {
    //       that.setData({
    //         loading: !1
    //       });
    //     }, 1e3);
    //     that.setData({
    //       count: res.data.count,
    //     });
    //   }
    // })
  },
  goWechat: function(){
    wx.navigateTo({
      url: "../wechat/wechat"
    })
  },
  clickOver: function () {
    var that = this;
    if (that.data.selectedCourse == '') {
      wx.showToast({
        title: '请选择分类',
        icon: 'loading'
      })
      return false
    }

    if (this.data.userInfo.avatarUrl == undefined || this.data.userInfo.avatarUrl == '') {
      // this.login();
      this.goWechat();
      return
    }
    
    return that.data.loading ? (that.setData({
      zzzToast: {
        show: !0,
        title: "稍等，正在更新最新题库"
      }
    }), void setTimeout(function () {
      that.setData({
        zzzToast: {
          show: !1,
          title: "稍等，正在更新最新题库"
        }
      });
    }, 1500)) : ("" != that.data.storageCourse && that.data.storageCourse != that.data.selectedCourse ? wx.showModal({
      title: "温馨提示",
      content: "之前的答题记录将清除，您确定要切换题库吗？",
      success: function (e) {
        e.confirm ? (wx.clearStorage(), that.goHome('change')) : e.cancel && console.log("用户点击取消");
      }
    }) : that.goHome('first'))
  },

  goHome: function (action) {
    if (action == 'change') {
      this.getUserInfoAgain()
    } else {
      wx.switchTab({
        url: "../index/index"
      })
    }

    // wx.showLoading({
    //   title: '加载中',
    // })
    // var that = this;
    // wx.request({
    //   url: app.globalData.url + '/routine/auth_api/get_question_list',
    //   method: 'get',
    //   dataType: 'json',
    //   data: {
    //     uid: that.data.uid,
    //     cateid: that.data.selectedCate
    //   },
    //   success: function (res) {
    //     if (res.statusCode == 200) {
    //       var q = 'q_' + that.data.selectedCate, qid = 'qid_' + that.data.selectedCate, qData = res.data.data.question_list, qidData = res.data.data.question_id;
    //       wx.setStorage({
    //         key: q,
    //         data: qData,
    //         complete: function () {
    //           wx.setStorage({
    //             key: qid,
    //             data: qidData,
    //             complete: function () {
    //               question.initQuestions(q, qid);
    //             }
    //           });
    //           wx.hideLoading();
    //           wx.setStorageSync('category', { 'id': that.data.selectedCate, 'name': that.data.selectedCateName, 'number': that.data.selectedCateNum, 'time': that.data.selectedCateTime, 'passf': that.data.selectedCatePassf, 'count': that.data.count })
    //           wx.switchTab({
    //             url: "../index/index"
    //           })
    //         }
    //       });
    //     }
    //   }
    // })
  },

  getUserInfoAgain() {
    var that = this
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        var userInfo = res.userInfo
        wx.login({
          success: function (res) {
            if (res.code) {
              userInfo.code = res.code;
              userInfo.spid = app.globalData.spid;
              userInfo.company = that.data.userInfo.company || '';
              wx.request({
                url: app.globalData.url + '/routine/login/index',
                method: 'post',
                dataType: 'json',
                data: {
                  info: userInfo
                },
                success: function (res) {
                  console.log(res)
                  wx.setStorageSync('uid', res.data.data.uid);
                  app.globalData.uid = res.data.data.uid;
                  app.globalData.openid = res.data.data.routine_openid;
                  that.setData({
                    userInfo: res.data.data
                  });
                  wx.setStorageSync('userInfo', res.data.data);
                  var course = { 'id': that.data.selectedCourse, 'name': that.data.selectedCourseName }
                  wx.setStorageSync('course', course)
                  that.goHome('first')
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        });
      }, fail: function () {
        var course = { 'id': that.data.selectedCourse, 'name': that.data.selectedCourseName }
        wx.setStorageSync('course', course)
        wx.switchTab({
          url: "../index/index"
        })
      }
    })
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
                  wx.showToast({
                    title: '授权成功',
                    icon: 'success'
                  });
                  setTimeout(function () {
                    that.clickOver();
                  }, 1000)

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
  handleChange({ detail = {} }) {
    console.log(detail)
    this.setData({
      current: detail.value
    });
    for (var i = 0; i < this.data.courseList.length; i++) {
      if (this.data.courseList[i].name == detail.value) {
        console.log(this.data.courseList[i])
        this.setData({
          selectedCourse: this.data.courseList[i].id,
          selectedCourseName: this.data.courseList[i].name,
        })
        this.startInit()
        console.log(this.data.storageCourse);
        if (this.data.storageCourse == '') {
          var course = { 'id': this.data.courseList[i].id, 'name': this.data.courseList[i].name }
          wx.setStorageSync('course', course)
        }
        break;
      }
    }
  },
  input(e) {
    this.setData({
      searchVal: e.detail.value
    })
    this.search()
  },

  search() {
    var that = this;
    wx.showLoading({
      title: '',
    })
    var uid = app.globalData.uid;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_course_list',
      method: 'get',
      dataType: 'json',
      data: {
        uid: uid,
        keyword: that.data.searchVal
      },
      success: function (res) {
        let storageCourse = wx.getStorageSync('course');
        that.setData({
          courseList: res.data.data,
        })  
        console.log(that.data.current)
        wx.hideLoading()
      }
    })
  }
})