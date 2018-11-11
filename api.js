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
var marqueeList = ['小提醒:充值后若无法观看联系客服762008732', '小福利:累计充值满300元永久免费哦', '小公告:为防止被墙我们的永久域名是www.llh8.cn', '小提示:找不到喜欢的吗？搜索有你想要哦', '小条件:只有充值后才能观看完整版哦'];

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

// router.get('/', getIndex);
// router.get('/:page', getIndex);
router.get('/:page?/:title?', function (req,res) {
    if (req.url == '/favicon.ico' || (req.params.title && req.params.title.indexOf('javascript') > -1)) {
        res.send('');
    } else {
        if (req.params.page === 'detail' && Number(req.params.title)) {
            getDetail(req,res);
        } else if (req.params.page === 'user' && req.params.title === 'info') {
            getMine(req,res);
        } else if (req.params.page === 'user' && req.params.title === 'member') {
            getMember(req,res);
        } else {
            getIndex(req,res);
        }
    }
});
function getIndex(req,res) {
    // console.log(req.headers)
    // console.log(req.params, '2323')
    var page = [{label:1,url:'1'},{label:2,url:'2'},{label:3,url:'3'},{label:4,url:'4'},{label:5,url:'5'}];
    var currentReq = Number(req.params.page) || 1;
    var titleReq = req.params.title || '';
    // console.log(currentReq, titleReq);
    var limitBefore = ((currentReq - 1) * 12);
    var reNum = Math.floor(Math.random()*10+1) * 12;
    // var reNumBefore = (reNum == limitBefore ? reNum+12 : reNum);
    var sql = 'SELECT * FROM list order by createTime desc limit ' + (limitBefore + ',' + 12);
    var recommond = 'SELECT * FROM list where title like "%萝莉%" order by createTime desc limit ' + (reNum + ',' + 12);
    if (titleReq) {
        sql = 'SELECT * FROM list where title like "' +'%'+ titleReq +'%'+ '" order by createTime desc limit ' + (limitBefore + ',' + 12);
    }
    poolVip.getConnection(function (err, conn) {
        if (err) console.log("POOL ==> " + err);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message, 'sql', sql);
                // res.send('error');
                conn.release();
            } else {
                conn.query(recommond, function (err1, recommend) {
                    if (err1) {
                        console.log('recommond1- ', err1.message);
                        // res.render('index')
                    } else {
                        if (result.length) {
                            if (currentReq >= 5 || titleReq) {
                                var urlTitle = titleReq ? '/'+titleReq : '';
                                page = [{label: currentReq, url: currentReq, active: true}];
                                if(currentReq > 1) page.unshift({label: '上一页', url: (currentReq - 1) + urlTitle});
                                if(result.length >= 12) page.push({label: '下一页', url: (currentReq + 1) + urlTitle});
                            } else {
                                page[currentReq-1].active = true;
                                page.push({label:'下一页',url: currentReq+1});
                            }
                            console.log(currentReq, titleReq)
                        } else{
                            page = [];
                        }
                        var listObj = {
                            listData: result,
                            pageTitle: (titleReq || '网红萝莉吧') + (currentReq > 1 ? '-第' + currentReq + '页' : ''),
                            pageKeyword: '网红萝莉,萝莉图片,动漫萝莉,萝莉酱',
                            pageDescrition: '网红萝莉有你,萝莉吧给你想要哦',
                            marqueeList: marqueeList,
                            recommend: recommend,
                            page: page,
                            currentPage: currentReq,
                            titlePage: titleReq,
                            userInfo: req.session.loginUser,
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

function getDetail (req,res) {
    var testLook = {};
    var user = req.session.loginUser;
    var sql = 'SELECT * FROM defDetail where createTime = ' + '"' + req.params.title +'"';
    var reNum = Math.floor(Math.random()*20+1) * 12;
    var recommond = 'SELECT * FROM list order by createTime desc limit ' + (reNum + ',' + 12);
    poolVip.getConnection(function (err, conn) {
        if (err) console.log("POOL ==> " + err);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('[detail ERROR] - ', err.message);
                // res.send('error');
                conn.release();
            } else {
                conn.query(recommond, function (err1, recommend) {
                    if (err1) {
                        console.log('detail1- ', err1.message);
                        // res.render('index')
                    } else {
                        if (!result[0]) {
                            result = {};
                        } else {
                            result = result[0];
                        }
                        if (user) {
                            testLook = {id: 'test-look', cont: '你目前还不是VIP会员，只能试看两分钟。', goVip: true};
                            if (user.endDate) {
                                var time = new Date().getTime();
                                var endTime = new Date(user.endDate.replace(/-/g, '/')).getTime();
                                if (endTime > time || Number(user.total) > 300) {
                                    result.video = result.video ? result.video.split('?end=')[0] : '';
                                    testLook = {};
                                }
                            }
                        } else {
                            testLook = {id: 'test-look', cont: '你目前还没有登入，只能试看两分钟。', goVip: ''};
                        }
                        var listObj = {
                            videoData: result,
                            pageTitle: result.title || '资源不存在',
                            pageKeyword: result.title || '资源不存在',
                            pageDescrition: '网红萝莉有你，萝莉吧给你想要哦',
                            marqueeList: marqueeList,
                            recommend: recommend.slice(0,8),
                            userInfo: user,
                            testLook: testLook,
                            host: 'http://'+req.headers['host']
                        }
                        res.render('detail', listObj);
                    }
                    conn.release();
                });
            }
        });
    });
};

function getMine (req, res) {
    var user = req.session.loginUser;
    var userLevel = '普通会员';
    var expiryTime = '已到期';
    if (user && user.endDate) {
        var endTime = new Date(user.endDate.replace(/-/g, '/')).getTime();
        if (endTime > new Date().getTime() || Number(user.total) > 300) {
            userLevel = 'VIP会员';
            expiryTime = Number(user.total) > 300 ? '永久' : user.endDate;
        }
    }
    var listObj = {
        pageTitle: user ? user.userName+'-网红萝莉吧个人中心' : '网红萝莉吧个人中心',
        pageKeyword: user ? user.userName+'-个人中心' : '个人中心',
        pageDescrition: '网红萝莉有你，萝莉吧给你想要哦',
        userName: user ? user.userName : '无',
        userLevel: userLevel,
        expiryTime: expiryTime,
        host: 'http://'+req.headers['host']
    }
    res.render('mine', listObj);
}

function getMember (req, res) {
    var user = req.session.loginUser;
    var sql = 'SELECT * FROM list'
 
    var listObj = {
        pageTitle: '会员充值',
        pageKeyword: '会员充值',
        pageDescrition: '网红萝莉有你，萝莉吧给你想要哦',
        user: user,
        listData: [],
        balance: user ? user.balance : 0,
        host: 'http://'+req.headers['host']
    }
    if (user && user.auth === '1') {
        if (user.type) {
            sql = sql + ' where type like "%'+ user.type +'%"';
        }
        poolUser.getConnection(function (err, conn) {
            if (err) console.log("POOL userlist-register==> " + err);
            conn.query(sql, function (err, result) {
                listObj.listData = result;
                res.render('member', listObj);
                conn.release();
            });
        });
    } else {
        res.render('member', listObj);
    }
}

// 更新用户列表
router.post('/updateUser', function (req, res, next) {
    var login = req.session.loginUser;
    var userList = ['ashunadmin'];
    var sql = 'update list set endDate = "'+ req.body.endDate +'",total = "'+ req.body.total +'" where userName = "'+ req.body.userName + '"';
    if(login && userList.indexOf(login.userName) > -1) {
        poolUser.getConnection(function (err, conn) {
            if (err) console.log("POOL userlist-register==> " + err);
            conn.query(sql, function (err, result) {
                res.json({success: '更新成功'});
                conn.release();
            });
        });
    } else {
        res.json({error: '更新失败'});
    }
});

router.post('/register', function (req, res) {
    var userName = req.body.userName? req.body.userName.replace(/(^\s*)|(\s*$)/g, "") : '';
    var err = vaidParams(userName, req.body.password);
    var sql = 'SELECT * FROM list where userName = "'+ userName + '"';
    var sql2 = "INSERT INTO list(userName, password, total, type) VALUES (?, ?, ?, ?)";
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
                    conn.query(sql2, [userName, req.body.password, '0', req.headers['host']], function (err1, result1) {
                        if (err1) {
                            console.log('register1- ', err1.message);
                            res.json({error: '系统出错请重新操作2'});
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

// 退出登录
router.post('/logout', function (req, res, next) {
    req.session.loginUser = null;
    res.clearCookie('testapp');
    res.json({success:'退出成功'});
});

// 重新查询登录
router.post('/refreshLogin', function (req, res, next) {
    var user = req.session.loginUser;
    if (user && user.userName) {
        var sql = 'SELECT * FROM list where userName = "'+ user.userName + '"';
        poolUser.getConnection(function (err, conn) {
            if (err) console.log("POOL refresh-register==> " + err);
            conn.query(sql, function (err, result) {
                if (result.length) {
                    delete result[0].password;
                    req.session.loginUser = result[0];
                }
                res.json({success: '结束'});
                conn.release();
            });
        });
    } else {
        res.json({error: ''});
    }
});
router.get('*', function (req, res, next) {
    var listObj = {
        pageTitle: '网红萝莉404页面',
        pageKeyword: '网红萝莉,萝莉图片,动漫萝莉,萝莉酱',
        pageDescrition: '网红萝莉有你,萝莉吧给你想要哦',
        host: 'http://'+req.headers['host']
    }
    res.status(404);
    res.render('404', listObj);
});

module.exports = router;