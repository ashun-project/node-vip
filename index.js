var express = require('express')
var app = express();
var cookie = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var api = require('./api');


app.use(cookie());
app.use(session({
    resave: true, // 是指每次请求都重新设置session cookie，假设你的cookie是6000毫秒过期，每次请求都会再设置6000毫秒
    saveUninitialized: false, // 是指无论有没有session cookie，每次请求都设置个session cookie 
    secret: '123456', //  加密
    name: 'testapp', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {
        maxAge: 18000000
    }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('view engine','jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(api);


app.listen(1337);


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
//     res.clearCookie('testapp');
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