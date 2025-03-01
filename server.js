// @ts-nocheck
const fetch = require('node-fetch');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

const emailSend = 'holltonliu@163.com'
// const emailRece = [emailSend, 'kkxx.ll@qq.com']
const emailRece = [emailSend]
const emailPass = 'GGcvRj6VNjCtcPQT'

// 邮件发送配置
const transporter = nodemailer.createTransport({
    host: 'smtp.163.com', // 使用163邮箱的SMTP服务器
    port: 465, // 端口号
    secure: true, // 使用SSL
    auth: {
        user: emailSend, // 替换为你的163邮箱
        pass: emailPass  // 替换为你的163邮箱密码
    }
});

// 获取金价数据的函数
async function getGoldPrice() {
    const url = 'https://sapi.k780.com/?app=finance.gold_price&goldid=1053&appkey=75649&sign=105ba218ce6402626f2905f646d8f440&format=json';
    const response = await fetch(url);
    const data = await response.json();
    return data.result.dtList["1053"];
}

// 发送邮件的函数
async function sendEmail(price) {
    const mailOptions = {
        from: emailSend, // 发件人邮箱
        to: emailRece.join(','), // 收件人邮箱，使用数组并转换为逗号分隔的字符串
        subject: '今日实时金价', // 邮件主题
        text: `实时金价为：${price}元/克` // 邮件内容
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// 设置定时任务，每天上午10点执行
schedule.scheduleJob('0 10 * * *', async function(){
    const { last_price } = await getGoldPrice();
    await sendEmail(last_price);
});

console.log('定时任务已启动，每天上午10点发送金价邮件。');