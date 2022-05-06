// pages/moni/moni.js
var r = "",
    a = require("../../utils/underscore-min.js"),
    question = require('../../utils/question.js'),
    s = 1,
    d = [],
    n = "",
    i = [];
    let app = getApp();    
var util = require('../../utils/util.js');
Page({

  data: {
      index: 0,
    // 滑动到的位置
    swiperDuration: "250",
    // 需要几个swiperItem, 最少值为3,如果有分页的需求，可以是10、20, 任何
    rightMap:{

    },
    errorids:[],
    starids:[],
    startShowStatus:[],
    me: [],
    typeArr:[],
    orderPX:{},
    redNum: 0,
    greenNum: 0,
    allNum: 0,
    iconInd: !1,
    iconIndtwo: !1,
    indexInd: 0,
    current: 0,
    textTab: "答题模式",
    selectInd: !0,
    testMode: !1,
    circular: true,
    interval: 300,
    mode: "1",
    recmend: !1,
    cateName:"",
    mode:'',
    starshow: !1,
    currIndex: 0, //数据索引
    swiperIndex: 0, //swiper索引
    swiperItems: []
  },

  onLoad: function (options) {
      let that = this;

      console.log(options);
      //  根据 sitemap 的规则[0]，当前页面 [pages/moni/moni?mode=undefined&cateid=55] 将被索引
      let cateid = options.cateid;

      wx.getStorage({
        key: "starids"+cateid,
        success: function (res) {
          console.log('收藏信息：')
          console.log(res);
          that.setData({
            starids: res.data
          })
        }
      })

      let _q = 'q_' + cateid;
      let _qid = 'qid_' + cateid;
      question.initQuestions(_q, _qid);
  
      let idArr = question.questionIds["questionId"];
      // let allQues = question.questions["question"];

      
      let rightMap = question.questions['rightMap'];
      // let idArr = wx.getStorageSync(_qid);
      
      let question_ids = [];
      let questions = [];
      let mode = options.mode;
      let nums = idArr.length;

    
      question_ids = idArr;
      this.newFormatData();
      let allQues = question.questions["items"];

      let newFormatItems = allQues.slice(0,1);
      // 0,1,2
      
      let typeArr = [{
          typename: '单选',
          len: 0,
          ids: []
        },{
          typename: '多选',
          len: 0,
          ids: []
        },{
          typename: '判断',
          len: 0,
          ids: []
        },{
          typename: '填空',
          len: 0,
          ids: []
        },{
          typename: '简答',
          len: 0,
          ids: []
        }];
      allQues.forEach( qu => {
        typeArr[qu.type-1]['ids'].push(qu.id);
      })
      typeArr[0]['len'] = 0;
      typeArr[1]['len'] = 0 + typeArr[0]['ids'].length;
      typeArr[2]['len'] = 0 + typeArr[0]['ids'].length + typeArr[1]['ids'].length;
      typeArr[3]['len'] = 0 + typeArr[0]['ids'].length + typeArr[1]['ids'].length + typeArr[2]['ids'].length;
      typeArr[4]['len'] = 0 + typeArr[0]['ids'].length + typeArr[1]['ids'].length + typeArr[2]['ids'].length + typeArr[3]['ids'].length;
  
      setTimeout(()=>{
        this.setData({
          typeArr
        })
      },1000)

      let id = question_ids[0];
      setTimeout(()=>{
        let starshow = false;
        if(that.data.starids.indexOf(id)!=-1){
          starshow = true;
        }
        that.setData({
          starshow
        })
      },1000)

      app.globalData.questions = allQues;
      let swiperItems = allQues.slice(0,3);
      console.log(swiperItems);
      

      this.setData({
        rightMap,
        cateid,
        idArr,
        swiperItems,
        nums
      },()=>{
        console.log('信息初始化完成');
      })
      
  },
  onReady: function () {

  },

  onShow: function () {

  },

  init_play:function(options,question_ids){
    let mode = options.mode;
    wx.setNavigationBarTitle({
      title: '顺序练习',
    });
    this.onQuery(options);

  },
  onQuery:function(options){
    // this.ind_to_data();
  },
  ind_to_data: function () {
    let that = this;

    console.log('初始化');
    console.log(questions);
    console.log(this.data.indexInd);
    console.log(questions[this.data.indexInd]);

    this.formatData(this.data.idArr,this.data.indexInd);
   
  },
  formatData: function(idArr,index){
    console.log('format');
    let allQues = question.questions["items"];
    let that = this;
    let obj = allQues[index];
    let answer = obj.answer;
    let options = obj.options;
    let arr = [];
    let type = obj.type;

    let newOptions = [];
    switch(type){
      case 1:
      case 2:
      case 3:
        Object.keys(options).forEach(key => {
          let val = 0;
          if(answer.indexOf(key) != -1){
            val =1;
          }
          arr.push({
            code: key,
            content: options[key],
            selected: false,
            val: val
          })
        })
        obj.options = arr;
        break
      case 4:
      case 5:
        // 根据答案自己拼接选项
        let aItems = obj.answer.split('|');
        
        aItems.forEach((aItem, idx)=>{
          let newOption = {
            code: idx,
            content: aItem,
            selected: false,
            val: 1
          }
          newOptions.push(newOption)
        })
        obj.options = newOptions;
        break;
      default:
        console.log('未知匹配')
    }
    obj.right = -1;
    return obj;
    let questions = this.data.questions;
    questions[index] = obj;
    console.log('格式化');
    console.log(question);
    questions[index+1] = null;
    this.setData({
      questions 
    })
  },
  newFormatData: function(){
    console.log('format');
    let allQues = question.questions["items"];
    allQues.map((obj)=>{
      let answer = obj.answer;
      let options = obj.options;
      let arr = [];
      let type = obj.type;
  
      let newOptions = [];
      let me = [];
      switch(type){
        case 1:
        case 2:
        case 3:
          Object.keys(options).forEach(key => {
            let val = 0;
            if(answer.indexOf(key) != -1){
              val =1;
            }
            arr.push({
              code: key,
              content: options[key],
              selected: false,
              val: val
            })
          })
          obj.options = arr;
          break
        case 4:
        case 5:
          // 根据答案自己拼接选项
          let aItems = obj.answer.split('|');
          
          aItems.forEach((aItem, idx)=>{
            let newOption = {
              code: idx,
              content: aItem,
              selected: false,
              val: 0
            }
            newOptions.push(newOption);
            me.push('');
          })
          obj.options = newOptions;
          obj.me = me;
          
          break;
        default:
          console.log('未知匹配')
      }
      obj.selected = false;
      obj.right = -1;
    })

    
  },
  jumpToQuestion: function (e) {
    console.log('jump');
    console.log(e.currentTarget.dataset);
    let id = e.currentTarget.dataset.id;
    console.log('index');
    console.log(id);
    console.log(this.data.idArr);
    let index = this.data.idArr.indexOf(id+'');
    
    let allQues = app.globalData.questions;
    let swiperItems = allQues.slice(index,index+3);
    console.log(swiperItems);

    this.setData({
      currIndex: index,
      swiperItems,
      index,
      circular: true,
      iconInd: false,
      iconIndtwo: false,
      videoctrl: true
    },()=>{
      // this.autoPlay();
      console.log('jump结束');
    });

      return;

    
    if(index>this.data.indexInd){
      this.formatData(this.data.idArr,index);
    }
    

    this.setData({
      circular: false,
      iconInd: false,
      iconIndtwo: false,
      current: index,
      indexInd: index,
      videoctrl: true
    },()=>{
      // this.autoPlay();
      console.log('设置完');
    });
  },
  starcollect:function(){
    let starshow = !this.data.starshow;
    this.setData({
      starshow:starshow
    });
    let startShowStatus = this.data.startShowStatus;
    let starids = this.data.starids;
    let questions = app.globalData.questions;
    let question = questions[this.data.currIndex];
    startShowStatus[this.data.index] = starshow;
    starids.push(question.id)
    this.setData({
      startShowStatus,
      starids
    })
    wx.setStorage({
      key: 'starids' + this.data.cateid,
      data: starids
    })

  },
  touchstart: function (t) { },
  bindtouchmove: function (t) { },
  bindtouchend: function (t) { },
  selectAnswer: function (e) {
    console.log(new Date());
    console.log('selectAnswer');
    console.log(new Date())
    console.log(app.globalData.questions);
    console.log(e);
    console.log(e.currentTarget.dataset);
    let item = JSON.parse(e.currentTarget.dataset.value);
    if(item.selected){
      return;
    }
    let code = e.currentTarget.dataset.code;
    let answer = e.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    let rightMap = this.data.rightMap;
    item.right = 0;
    rightMap[item.id] = 0;
    
    let errorids = this.data.errorids;
    options.map(o => {
      if(o.code == code){
        o.selected = true;
      }
      if((o.code == code)&&(o.code == answer)){
        o.val = 1;
        greenNum++;
        item.right = 1;
        rightMap[item.id] = 1;
      }
      if((o.code == code)&&(o.code != answer)){
        o.val = 0;
        redNum++;
        errorids.push(item.id);
      }
    })
    console.log('item');
    console.log(item);
    item.options = options;
    item.selected = true;
    app.globalData.questions[item.index] = item;

    let newSwiperItems = [];
    this.data.swiperItems.map((ele) => {
      let index = ele.index;
      console.log('更新：'+index);
      if(index == item.index){
        ele = item;
      }
      newSwiperItems.push(ele);
    })

    
    console.log(new Date())
    this.setData({
      swiperItems: newSwiperItems,
      rightMap,
      greenNum: greenNum,
      redNum: redNum,
      errorids
    },()=>{
      console.log(new Date())

    })
    if(item.right == 0){
      wx.setStorage({
        key: 'errorids' + this.data.cateid,
        data: errorids
      })
    }
    
    if(item.right == 1 && this.data.currIndex < this.data.nums-1){
      this.autoPlay();
    }
    
  },
  selectAnswerMore: function (t) {
    console.log('多选选第二个选项')
    console.log('selectAnswerMore');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    let code = t.currentTarget.dataset.code;
    let answer = t.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    options.map(o => {
      if(o.code == code){
        o.selected = !o.selected;
      }
    })
    item.options = options;

    app.globalData.questions[item.index] = item;

    let swiperItems = this.data.swiperItems;
    let newSwiperItems= [];
    swiperItems.map((ele) => {
      let index = ele.index;
      console.log('更新：'+index);
      if(index == item.index){
        ele = item;
      }
      newSwiperItems.push(ele);
    })
    this.setData({
      swiperItems: newSwiperItems
    })

  },
  newMoreSelectSub: function(t){
    setTimeout(()=>{
      this.moreSelectSub(t);
    },1000)
  },
  moreSelectSub: function (t) {
    console.log('多选');
    console.log('moreSelectSub');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    let options = item.options;

    let answer;
    let nums = 0;

    let redNum = this.data.redNum;
    let greenNum = this.data.greenNum;


    let me = this.data.me;
    let rightMap = this.data.rightMap;
    item.right = 0;
    
    rightMap[item.id] = 0;
    let errorids = this.data.errorids;
    let type = item.type;
    switch(type){
      case 1:
      case 2:
      case 3:
        answer = item.answer.split('');
        options.forEach(o => {
          if(o.selected){
            nums++;
          }
        })

        item.right = 0;
        if(nums == answer.length){
          item.right = 1;
          rightMap[item.id] = 1;
          greenNum++;
        }else{
          redNum++;
          errorids.push(item.id);
        }
        break;  
      case 4:  
      case 5:
        
        answer = item.answer.split('|');
        options.forEach(o => {
          if(me.indexOf(o.content) != -1){
            o.selected = 1;
            o.val = 1;
            nums++;
          }
        })

        let meArr = [];
        let j = 0;
        me.forEach((m,idx) => {
          j = idx;
          let val = 0;
          if(answer.indexOf(m) != -1){
            val =1;
          }
          meArr.push({
            code: idx,
            content: m,
            selected: true,
            val: val
          })
        })
        while(meArr.length < options.length){
          j++;
          meArr.push({
            code: j,
            content: '',
            selected: true,
            val: 0
          })
        }
        console.log('格式化后结果')
        console.log(meArr);
        item.meArr = meArr;

        item.right = 0;
        if(nums == answer.length){
          rightMap[item.id] = 1;
          item.right = 1;
          greenNum++;
        }else{
          redNum++;
          errorids.push(item.id);
        }
        break;                      
      default: 
      console.log('其他未涉及题型')
    }

    item.me=me;
    app.globalData.questions[item.index] = item;


    let swiperItems = this.data.swiperItems;
    console.log(swiperItems);
    let newSwiperItems = [];
    swiperItems.map((ele) => {
      let index = ele.index;
      console.log('更新：'+index);
      if(index == item.index){
        ele = item;
      }
      newSwiperItems.push(ele);
    })

    this.setData({
      swiperItems: newSwiperItems,
      rightMap,
      redNum,
      greenNum,
      errorids
    },()=>{
      console.log('多选提交完成')
      wx.setStorage({
        key: 'errorids' + this.data.cateid,
        data: errorids
      })
    })
    console.log('item');
    console.log(item);

    if(item.right == 1 &&  this.data.currIndex < this.data.nums-1){
      this.autoPlay();
    }
  },
  bindKeyInput: function (e) {
    // console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindBlurInput: function (e) {
    // console.log(e.detail.value);
    let me = this.data.me;
    if(e.detail.value){
      me.push(e.detail.value);
    }
    
    // console.log(me);
    this.setData({
      me,
      inputValue: e.detail.value
    })
  },
  autoPlay: function () {
    console.log(new Date());
    console.log('autoplay');

      this.setData({
        autoplay: true
      });
  },
  pageChange: function (e) {
    console.log(new Date());
    console.log('pageChange');
    console.log(e.detail);

    console.log('[滑动]');
    console.log(this.data.currIndex);
    console.log(app.globalData.questions.length);
   

    //更新swiper索引
    let newCurrent = e.detail.current;
    let oldCurrent = this.data.swiperIndex;
    this.data.swiperIndex = newCurrent;

    //更新数据索引
    if (newCurrent === oldCurrent + 1 || oldCurrent + 1 === this.data.swiperItems.length + newCurrent) { //正向
      console.log('正向')
      this.data.currIndex++;
    } else { //逆向
      console.log('逆向')
      this.data.currIndex--;
    }

    //数据索引边界处理
    if (this.data.currIndex > app.globalData.questions.length - 1) {
      this.data.currIndex = 0;
    } else if (this.data.currIndex < 0) {
      this.data.currIndex = app.globalData.questions.length - 1;
    }

    let swiperItems = this.data.swiperItems;
    
    //确定三个item的数据值
    let curr = app.globalData.questions[this.data.currIndex]
    let next = this.data.currIndex === app.globalData.questions.length - 1 ? 0 : app.globalData.questions[this.data.currIndex + 1];
    let pre = this.data.currIndex === 0 ? app.globalData.questions[app.globalData.questions.length - 1] : app.globalData.questions[this.data.currIndex - 1];

    console.log(new Date());
    //当前item不用处理，其他两个item更新显示；
    if (this.data.swiperIndex === 0) {
      swiperItems[1] = next;
      swiperItems[2] = pre;
    } else if (this.data.swiperIndex === 1) {
      swiperItems[0] = pre;
      this.data.swiperItems[2] = next;
    } else if (this.data.swiperIndex === 2) {
      swiperItems[0] = next;
      swiperItems[1] = pre;
    }
    
    
    this.setData({
      currIndex: this.data.currIndex,
      swiperItems: swiperItems,
      circular: true,
      me:[],
      starshow: false,
      autoplay: false
    },()=>{
      console.log(this.data.swiperItems);
      console.log(new Date());
    })

  },

  _updown: function () {
    console.log(this.data.iconInd);
    this.setData({
      iconInd: !this.data.iconInd,
      iconIndtwo: !this.data.iconIndtwo,
    });
  },
  changeTab: function (t) {
    this.setData({
      textTab: t.currentTarget.dataset.texttab,
      selectInd: "答题模式" == t.currentTarget.dataset.texttab
    })
  },
  del_data:function(){
    var t = this;
    wx.showModal({
      content: '确定要清空吗？',
      success:function(a){
        if(a.confirm){
          wx.switchTab({
            url: "../index/index"
          })
        }
      }
    })
  },
  onUnload: function() {

  },
  result:function(t){
    console.log(t)

  }

})