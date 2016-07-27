/**
 * 问卷的基本问题&答案
 * Created by xiuxiu on 2016/6/23.
 */
define('h5/js/common/questionData',[],function(){
    //基础题
    var questionArr = [
        {
            question: {
                id:1,
                optionsSelectableMaxnum: "10",
                questionDes: "",
                questionName: "生活状态",


            },
            questionType: 1,
            isend: false,
            optionsList: [
                {
                id:1,
                optionDes: "",
                optionName: "压力较大"

            },{
                id:2,
                optionDes: "",
                optionName: "睡眠不足、多梦、易醒"

            },{
                id:3,
                optionDes: "",
                optionName: "饮食不均衡或不规律"

            },{
                id:4,
                optionDes: "",
                optionName: "压力大 "

            },{
                id:5,
                optionDes: "",
                optionName: "经常在冷暖空调房"

            },{
                id:6,
                optionDes: "",
                optionName: "经常晒太阳"

            },{
                id:7,
                optionDes: "",
                optionName: "抽烟"

            },{
                id:8,
                optionDes: "",
                optionName: "喝酒"

            },{
                id:9,
                optionDes: "",
                optionName: "咖啡"

            },{
                id:10,
                optionDes: "",
                optionName: "无"

            }]
        },
        {
            question: {
                id:2,
                optionsSelectableMaxnum: "13",
                questionDes: "",
                questionName: "身体健康情况",

            },
            questionType: 1,
            isend: false,
            questionShowValue:2,
            optionsList: [
                {
                id:11,
                optionDes: "",
                optionName: "易疲劳"

            },{
                id:12,
                optionDes: "",
                optionName: "早上起床难"

            },{
                id:13,
                optionDes: "",
                optionName: "易感冒、不易好"

            },{
                id:14,
                optionDes: "",
                optionName: "易燥"

            },{
                id:15,
                optionDes: "",
                optionName: "肩颈易酸痛"

            },{
                id:16,
                optionDes: "",
                optionName: "唇部易干燥"

            },{
                id:17,
                optionDes: "",
                optionName: "怕冷"

            },{
                id:18,
                optionDes: "",
                optionName: "记性差"

            },{
                id:19,
                optionDes: "",
                optionName: "便秘"

            },{
                id:20,
                optionDes: "",
                optionName: "季节变化时鼻子眼睛氧"

            },{
                id:21,
                optionDes: "",
                optionName: "不容易出汗"

            },{
                id:22,
                optionDes: "",
                optionName: "月经不调"

            },{
                id:23,
                optionDes: "",
                optionName: "无"

            }]
        },
        {
            question: {
                id:3,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "家庭生活",

            },
            questionType: 1,
            isend: false,
            optionsList: [
                {
                    id: 24,
                    optionDes: "",
                    optionName: "家庭环境压力"
                },
                {
                    id: 25,
                    optionDes: "",
                    optionName: "夫妻生活"
                }]
        },
        {
            question: {
                id:4,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "容易出现痘痘吗？",

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id:1,
                    optionDes: "",
                    optionName: "经常"

                }, {
                    id:2,
                    optionDes: "",
                    optionName: "偶尔"

                },{
                    id:3,
                    optionDes: "",
                    optionName: "一个月一次左右"

                },{
                    id:4,
                    optionDes: "",
                    optionName: "经期前"

                },{
                    id:5,
                    optionDes: "",
                    optionName: "几乎不长"

                }]
        },
        {
            question: {
                id:5,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "您皮肤脸颊容易泛红吗？",

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id:6,
                    optionDes: "",
                    optionName: "非常红"

                },{
                    id:7,
                    optionDes: "",
                    optionName: "会发红、微红"


                },{
                    id:8,
                    optionDes: "",
                    optionName: "不发红、不清楚"

                }]
        },
        {
            question: {
                id:6,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "有无过敏史及程度：",

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id:9,
                    optionDes: "",
                    optionName: "长期 （经常过敏，现象严重）"

                },{
                    id:10,
                    optionDes: "",
                    optionName: "偶尔 （换季、日晒、对特定成分、药物、激光或磨皮导致过敏）"
                },{
                    id:11,
                    optionDes: "",
                    optionName: "无"
                }]
        }
    ];
    return questionArr;
})
