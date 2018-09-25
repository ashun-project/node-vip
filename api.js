var express = require('express');
var router = express.Router();
var menuList = [
    {
        url: '/',
        title: '区域一'
    },
    {
        url: '/',
        title: '区域二'
    },
    {
        url: '/',
        title: '区域三'
    },
    {
        url: '/',
        title: '区域四'
    }
];
var marqueeList = ['恭喜发财', '鸿运吉祥']
router.get('/', function(req,res) {
    // var sql = 'SELECT * FROM sanjilist WHERE title like "%三%"';
    // pool.getConnection(function (err, conn) {
    //     if (err) console.log("POOL ==> " + err);
    //     conn.query(sql, function (err, result) {
    //         if (err) {
    //             console.log('[SELECT ERROR] - ', err.message);
    //             // res.send('error');
    //         } else {
    //             // res.json(result);
    //             console.log(result, '====')
    //         }
    //         conn.release();
    //     });
    // })
    var list = [
        {url: 'www.baidu.com', createDate: '132', title: '有你喜欢', img: './img/aa.png'},
        {url: 'www.baidu.com', createDate: '132', title: '有你喜欢', img: './img/aa.png'},
        {url: 'www.baidu.com', createDate: '132', title: '真的吗', img: './img/aa.png'},
        {url: 'www.baidu.com', createDate: '132', title: '有你喜欢', img: './img/aa.png'},
        {url: 'www.baidu.com', createDate: '132', title: '征服世界', img: './img/aa.png'},
        {url: 'www.baidu.com', createDate: '132', title: '天下有你', img: './img/aa.png'}
    ]
    res.render('index',{pageTitle:'使用示例', pageKeyword: '你/萝莉红吧,萝莉', pageDescrition: '萝莉红吧', layout:false, listData: list, menuList: menuList, marqueeList: marqueeList});
});

module.exports = router;




// const bodyParser = require('body-parser');
// const cookie = require('cookie-parser');
// const express = require('express');
// const app = express();
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);
// const identityKey = 'skey';
// const mysql = require('mysql');
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'ashun666',
//     database: 'user'
// });

// app.use(cookie());
// app.use(session({
//     // resave: false, // 是指每次请求都重新设置session cookie，假设你的cookie是6000毫秒过期，每次请求都会再设置6000毫秒
//     // saveUninitialized: false, // 是指无论有没有session cookie，每次请求都设置个session cookie
//     // // store: new FileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
//     // secret: '123456', //  加密
//     // name: identityKey, //这里的name值得是cookie的name，默认cookie的name是：connect.sid
//     // cookie: {
//     //     maxAge: 16000
//     // }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
//     resave: true, // 是指每次请求都重新设置session cookie，假设你的cookie是6000毫秒过期，每次请求都会再设置6000毫秒
//     saveUninitialized: false, // 是指无论有没有session cookie，每次请求都设置个session cookie 
//     secret: '123456', //  加密
//     name: 'testapp', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
//     cookie: {
//         maxAge: 18000000
//     }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
// }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: false
// }));

// function vaidParams(userName, password) {
//     var error = '';
//     if (!userName || !password) {
//         error = '用户或密码不能为空';
//     }
//     if (userName.length > 12 || password.length > 12) {
//         error = '用户或密码不可超过12位';
//     }
//     if (userName.length < 3 || password.length < 3) {
//         error = '用户或密码不可小于3位';
//     }
//     return error;
// }

// // 接口
// app.post('/vdidLogin', function (req, res, next) {
//     if (req.session.loginUser) {
//         res.json(req.session.loginUser);
//     } else {
//         res.json({error: 'no'});
//     }
// });

// app.post('/register', function (req, res) {
//     var userName = req.body.userName? req.body.userName.replace(/(^\s*)|(\s*$)/g, "") : '';
//     var err = vaidParams(userName, req.body.password);
//     var sql = 'SELECT * FROM list where userName = "'+ userName + '"';
//     var sql2 = "INSERT INTO list(userName, password) VALUES (?, ?)";
//     if (err) {
//         res.json({error: err});
//         return;
//     }
//     pool.getConnection(function (err, conn) {
//         if (err) console.log("POOL register==> " + err);
//         conn.query(sql, function (err, result) {
//             if (err) {
//                 console.log('register - ', err.message);
//                 res.json({error: '系统出错请重新操作'});
//                 conn.release();
//             } else {
//                 if (!result[0]) {
//                     conn.query(sql2, [userName, req.body.password], function (err1, result1) {
//                         if (err1) {
//                             console.log('register1- ', err1.message);
//                             res.json({error: '系统出错请重新操作'});
//                         }  else {
//                             req.session.loginUser = {userName: userName};
//                             res.json({userName: userName});
//                         }
//                         conn.release();
//                     });
//                 } else {
//                     res.json({error: '用户已存在'});
//                     conn.release();
//                 }
//             }
//         });
//     });
// });

// app.post('/login', function (req, res, next) {
//     // 获取所有列表
//     var userName = req.body.userName? req.body.userName.replace(/(^\s*)|(\s*$)/g, "") : '';
//     var err = vaidParams(userName, req.body.password);
//     var sql = 'SELECT * FROM list where userName = "'+ userName + '"';
//     if (err) {
//         res.json({error: err});
//         return;
//     }
//     pool.getConnection(function (err, conn) {
//         if (err) console.log("POOL login==> " + err);
//         conn.query(sql, function (err, result) {
//             if (err) {
//                 console.log('login--', err.message);
//                 res.json({error: '系统出错请重新操作'});
//             } else {
//                 if (result.length) {
//                     if (req.body.password === result[0].password) {
//                         // req.session.regenerate(function (err) {
//                         //     if (err) {
//                         //         res.json({error: '登录失败' });
//                         //     } else {
//                         //         delete result[0].password;
//                         //         req.session.loginUser = result[0];
//                         //         res.json(result[0]);
//                         //     }
//                         // });
//                         delete result[0].password;
//                         req.session.loginUser = result[0];
//                         res.json(result[0]);
//                     } else {
//                         res.json({error: '用户或密码不正确'});
//                     }
//                 } else {
//                     res.json({error: '用户不存在'});
//                 }
//             }
//             conn.release();
//         });
//     });
// });

// // 重新查询登录
// app.post('/refreshLogin', function (req, res, next) {
//     var user = req.session.loginUser;
//     if (user && user.userName) {
//         var sql = 'SELECT * FROM list where userName = "'+ user.userName + '"';
//         pool.getConnection(function (err, conn) {
//             if (err) console.log("POOL refresh-register==> " + err);
//             conn.query(sql, function (err, result) {
//                 if (result.length) {
//                     delete result[0].password;
//                     req.session.loginUser = result[0];
//                 }
//                 res.json({success: '结束'});
//                 conn.release();
//             });
//         });
//     } else {
//         res.json({error: ''});
//     }
// });

// // 退出登录
// app.post('/logout', function (req, res, next) {
//     req.session.loginUser = null;
//     res.clearCookie(identityKey);
//     res.json({success:'退出成功'});
// });

// // 获取用户列表
// app.post('/userList', function (req, res, next) {
//     var login = req.session.loginUser;
//     var userList = ['ashunadmin'];
//     var limit =  '';
//     if (req.body.limit) {
//         limit = ' where userName = "'+ req.body.limit +'"';
//     }
//     var sql = 'SELECT * FROM list'+limit;
//     if(login && userList.indexOf(login.userName) > -1) {
//         pool.getConnection(function (err, conn) {
//             if (err) console.log("POOL userlist-register==> " + err);
//             conn.query(sql, function (err, result) {
//                 res.json({list: result});
//                 conn.release();
//             });
//         });
//     } else {
//         res.json({list: [], error: '请重新登入'});
//     }
// });

// // 更新用户列表
// app.post('/updateUser', function (req, res, next) {
//     var login = req.session.loginUser;
//     var userList = ['ashunadmin'];
//     var sql = 'update list set endDate ="'+ req.body.endDate +'",total = "'+ req.body.total +'" where userName = "'+ req.body.userName + '"';
//     if(login && userList.indexOf(login.userName) > -1) {
//         pool.getConnection(function (err, conn) {
//             if (err) console.log("POOL userlist-register==> " + err);
//             conn.query(sql, function (err, result) {
//                 res.json({success: '更新成功'});
//                 conn.release();
//             });
//         });
//     } else {
//         res.json({error: '更新失败'});
//     }
// });