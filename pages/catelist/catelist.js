let app = getApp();
let question = require('../../utils/question.js');
Page({

  data: {
    catelist: {}
  },

  onLoad: function (e) {
    var that = this;
    var course = wx.getStorageSync('course');
    var uid = app.globalData.uid;
    that.setData({
      mode: e.mode,
      action: e.action
    })
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_cate_list',
      method: 'get',
      dataType: 'json',
      data: {
        uid: uid,
        course: course.id
      },
      success: function (res) {
        that.setData({
          catelist: res.data.data,
        })
      }
    })
  },


  onReady: function () {

  },

  onShow: function () {

  },

  goquestion: function (t) {
    var category = { 
        'id': t.currentTarget.dataset.id, 
        'name': t.currentTarget.dataset.name, 
        'time': t.currentTarget.dataset.time, 
        'passf': t.currentTarget.dataset.passf, 
        'number': t.currentTarget.dataset.number
    }
    wx.setStorageSync('category' + t.currentTarget.dataset.id, category)
    if (this.data.action == 'question')
      this.reqQuestion(category.id);
    else if (this.data.action == 'rank')
      this.reqRank(category.id);
    else if (this.data.action == 'history')
      this.reqHistory(category.id);
    else
      this.reqExam(category.id);

  },

  reqQuestion: function (cateid) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var qid = wx.getStorageSync('qid_' + cateid);
    if (qid == '') {
      wx.request({
        url: app.globalData.url + '/routine/auth_api/get_question_list',
        method: 'get',
        dataType: 'json',
        data: {
          uid: app.globalData.uid,
          cateid: cateid
        },
        success: function (res) {
          if (res.statusCode == 200) {
            var q = 'q_' + cateid, qid = 'qid_' + cateid, qtype = 'qtype_' + cateid, qData = res.data.data.question_list, qidData = res.data.data.question_id, qType = res.data.data.question_type;
            wx.setStorage({
              key: q,
              data: qData,
              complete: function () {
                wx.setStorage({
                  key: qid,
                  data: qidData,
                  complete: function () {
                    question.initQuestions(q, qid);
                  }
                });
                wx.setStorage({
                  key: qtype,
                  data: qType,
                  complete: function () {
                    question.initQuestions(q, qid);
                  }
                });
                wx.hideLoading();
                var mode = that.data.mode;
                if(mode==2){
                  wx.navigateTo({
                    url: '/pages/random/random?mode=' + mode + '&cateid=' + cateid,
                  })
                }else{
                  wx.navigateTo({
                    url: '/pages/moni/moni?mode=' + mode + '&cateid=' + cateid,
                  })
                }

              }
            });
          }
        }
      })
    } else {
      wx.hideLoading();
      var mode = that.data.mode;
      if(mode==2){
        wx.navigateTo({
          url: '/pages/random/random?mode=' + mode + '&cateid=' + cateid,
        })
      }else{
        wx.navigateTo({
          url: '/pages/moni/moni?mode=' + mode + '&cateid=' + cateid,
        })
      }
    }

  },
  reqExam: function (cateid) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    console.log(cateid)
    var qid = wx.getStorageSync('qid_' + cateid);
    if (qid == '') {
      wx.request({
        url: app.globalData.url + '/routine/auth_api/get_question_list',
        method: 'get',
        dataType: 'json',
        data: {
          uid: app.globalData.uid,
          cateid: cateid
        },
        success: function (res) {
          if (res.statusCode == 200) {
            let q = 'q_' + cateid;
            let qid = 'qid_' + cateid;
            let qData = res.data.data.question_list;
            let qidData = res.data.data.question_id;
            wx.setStorage({
              key: q,
              data: qData,
              complete: function () {
                wx.setStorage({
                  key: qid,
                  data: qidData,
                  complete: function () {
                    question.initQuestions(q, qid);
                  }
                });
                wx.hideLoading();
                var e = that.data.mode;
                wx.navigateTo({
                  url: '/pages/examhome/examhome?cateid=' + cateid,
                })
              }
            });
          }
        }
      })
    } else {
      wx.hideLoading();
      var mode = that.data.mode;
      wx.navigateTo({
        url: '/pages/examhome/examhome?cateid=' + cateid,
      })
    }
  },
  reqRank: function (cateid) {
    wx.hideLoading();
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/rank/rank?cateid=" + cateid
      });
    }, 30);
  },
  reqHistory: function (cateid) {
    wx.navigateTo({
      url: '../grade/grade?cateid=' + cateid,
    })
  }

})