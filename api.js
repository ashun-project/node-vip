var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var poolUser = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ashun666',
    database: 'user'
});
var poolVip = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ashun666',
    database: 'vip'
});


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
var marqueeList = ['恭喜发财', '鸿运吉祥'];

function vaidParams(userName, password) {
    var error = '';
    if (!userName || !password) {
        error = '用户或密码不能为空';
    }
    if (userName.length > 12 || password.length > 12) {
        error = '用户或密码不可超过12位';
    }
    if (userName.length < 3 || password.length < 3) {
        error = '用户或密码不可小于3位';
    }
    return error;
}

router.get('/', getIndex);
router.get('/:page', getIndex);
router.get('/:page/:title', getIndex);
function getIndex(req,res) {
    // console.log(req.headers)
    // console.log(req.params, '2323')
    var page = [{label:1,url:'1'},{label:2,url:'2'},{label:3,url:'3'},{label:4,url:'4'},{label:5,url:'5'},{label:6,url:'6'},{label:7,url:'7'},{label:8,url:'8'}];
    var currentReq = Number(req.params.page) || 1;
    var titleReq = req.params.title || '';
    // console.log(currentReq, titleReq);
    var limitBefore = ((currentReq - 1) * 12);
    var reNum = Math.floor(Math.random()*20+1) * 12;
    var reNumBefore = (reNum == limitBefore ? reNum+12 : reNum);
    var sql = 'SELECT * FROM list order by createTime desc limit ' + (limitBefore + ',' + 12);
    var recommond = 'SELECT * FROM list order by createTime desc limit ' + (reNumBefore + ',' + 12);
    if (titleReq) {
        sql = 'SELECT * FROM list where title like "' +'%'+ titleReq +'%'+ '" order by createTime desc limit ' + (limitBefore + ',' + 12);
    }
    poolVip.getConnection(function (err, conn) {
        if (err) console.log("POOL ==> " + err);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                // res.send('error');
                conn.release();
            } else {
                conn.query(recommond, function (err1, recommend) {
                    if (err1) {
                        console.log('recommond1- ', err1.message);
                        // res.render('index')
                    }  else {
                        if (result.length) {
                            if (currentReq >= 10 || titleReq) {
                                var urlTitle = titleReq ? '/'+titleReq : '';
                                page = [{label: currentReq, url: currentReq, active: true}];
                                page.unshift({label: '上一页', url: (currentReq - 1) + urlTitle, available: currentReq <= 1});
                                page.push({label: '下一页', url: (currentReq + 1) + urlTitle, available: result.length < 12});
                            } else {
                                page[currentReq-1].active = true;
                            }
                            console.log(currentReq, titleReq)
                        } else{
                            page = [];
                        }
                        var listObj = {
                            listData: result,
                            pageTitle: '使用示例',
                            pageKeyword: '你/萝莉红吧,萝莉',
                            pageDescrition: '萝莉红吧',
                            marqueeList: marqueeList,
                            recommend: recommend,
                            page: page,
                            host: 'http://'+req.headers['host']
                        }
                        res.render('index', listObj);
                    }
                    conn.release();
                });
            }
        });
    });
};

router.post('/register', function (req, res) {
    var userName = req.body.userName? req.body.userName.replace(/(^\s*)|(\s*$)/g, "") : '';
    var err = vaidParams(userName, req.body.password);
    var sql = 'SELECT * FROM list where userName = "'+ userName + '"';
    var sql2 = "INSERT INTO list(userName, password) VALUES (?, ?)";
    if (err) {
        res.json({error: err});
        return;
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL register==> " + err);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('register - ', err.message);
                res.json({error: '系统出错请重新操作'});
                conn.release();
            } else {
                if (!result[0]) {
                    conn.query(sql2, [userName, req.body.password], function (err1, result1) {
                        if (err1) {
                            console.log('register1- ', err1.message);
                            res.json({error: '系统出错请重新操作'});
                        }  else {
                            req.session.loginUser = {userName: userName};
                            res.json({userName: userName});
                        }
                        conn.release();
                    });
                } else {
                    res.json({error: '用户已存在'});
                    conn.release();
                }
            }
        });
    });
});

router.post('/login', function (req, res, next) {
    // 获取所有列表
    var userName = req.body.userName? req.body.userName.replace(/(^\s*)|(\s*$)/g, "") : '';
    var err = vaidParams(userName, req.body.password);
    var sql = 'SELECT * FROM list where userName = "'+ userName + '"';
    if (err) {
        res.json({error: err});
        return;
    }
    poolUser.getConnection(function (err, conn) {
        if (err) console.log("POOL login==> " + err);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('login--', err.message);
                res.json({error: '系统出错请重新操作'});
            } else {
                if (result.length) {
                    if (req.body.password === result[0].password) {
                        delete result[0].password;
                        req.session.loginUser = result[0];
                        res.json(result[0]);
                    } else {
                        res.json({error: '用户或密码不正确'});
                    }
                } else {
                    res.json({error: '用户不存在'});
                }
            }
            conn.release();
        });
    });
});

module.exports = router;