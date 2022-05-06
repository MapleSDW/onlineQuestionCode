Page({

  data: {

  },

  onLoad: function (options) {
    //  根据 sitemap 的规则[0]，当前页面 [pages/examresult/examresult?greenNum=1&redNum=12&allNum=0&ytimes=2%3A51&allfen=0&passf=95&allQuestionCount=0] 将被索引
    console.log(options);
    var category = wx.getStorageSync('category');
    var ytimesf = options.ytimes.split(":")[0]
    var ytimesm = options.ytimes.split(":")[1]
    let allQuestionCount = options.allQuestionCount;
    let unit = parseInt(100/allQuestionCount);
    this.setData({
      options: options,
      category:category,
      rightNum: options.greenNum,
      errNum: options.redNum,
      unAnswerNum: options.allQuestionCount - options.allNum,
      ytimesf: ytimesf,
      ytimesm: ytimesm,
      unit: unit
    })

  },

  onReady: function () {

  },

  onShow: function () {

  },

  examBack: function () {
    console.log(this.data.options);
    let options = this.data.options;
    // 根据 sitemap 的规则[0]，当前页面 [pages/examresult/examresult?greenNum=1&redNum=12&allNum=0&ytimes=2%3A51&allfen=0&passf=95&allQuestionCount=0] 将被索引
    wx.redirectTo({
      url: "../exam/exam?action=review&times="+ options.times +"&cateid="+ options.cateid +"&timeback=1&passf=" + this.data.passf + "&time=" + (this.data._repeat_time - 1) + "&training_qids=0&nums=" + this.data.allQuestionCount
    });
  },

  exam_repeat: function () {
    this._repeat_examGo(this);
  },

  _repeat_examGo: function (e) {
    if (!e.data.category.time) return wx.showLoading({
      title: "考题读取中"
    }), void setTimeout(function () {
      wx.hideLoading();
    }, 999);
    wx.removeStorage({
      key: "exam" + this.data.category.id
    }), wx.removeStorage({
      key: "examlist" + this.data.category.id
    }), wx.removeStorage({
      key: "examind" + this.data.category.id
    }), wx.removeStorage({
      key: "examids" + this.data.category.id
    }), wx.removeStorage({
      key: "examall" + this.data.category.id
    }), wx.redirectTo({
      url: "../exam/exam?passf=" + e.data.category.passf + "&time=" + (e.data.category.time - 1) + "&training_qids=0&nums=" + e.data.category.number
    });
  }
})