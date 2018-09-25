var express = require('express')
var app = express();
var path = require('path');
var api = require('./api');
// var mysql = require('mysql');
// var pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'ashun666',
//     database: 'vip'
// });
// router.post('/api/getAllList', function (req, res) {
//     var sql = 'SELECT * FROM ' + req.body.title + 'list';
//     pool.getConnection(function (err, conn) {
//         if (err) console.log("POOL ==> " + err);
//         conn.query(sql, function (err, result) {
//             if (err) {
//                 console.log('[SELECT ERROR] - ', err.message);
//                 res.send('error');
//             } else {
//                 res.json(result);
//             }
//             conn.release();
//         });
//     })
// })
// router.post('/api/getList', function (req, res) {
//     // console.log(html)
//     var currentIp = getIp(req)
//     console.log('getList----' + req.body.title + '=====', currentIp)
//     if (currentIp.indexOf('195.201.218.75') > -1) {
//         // console.log('getList----',currentIp)
//         // res.send('who are you');
//         // return;
//     }
//     var limit = ((req.body.current - 1) * 20) + ',' + 20;
//     var sql = 'SELECT * FROM ' + req.body.title + 'list order by createTime desc limit ' + limit;
//     var count = 'SELECT COUNT(*) FROM ' + req.body.title + 'list';
//     pool.getConnection(function (err, conn) {
//         if (err) console.log("POOL ==> " + err);
//         conn.query(sql, function (err, result) {
//             if (err) {
//                 console.log('[SELECT ERROR] - ', err.message);
//                 res.send('error');
//                 conn.release();
//             } else {
//                 // res.json({total:21, data:result});
//                 conn.query(count, function (err, num) {
//                     if (err) {
//                         res.send('error');
//                     } else {
//                         var arr = result.map(item => {
//                             return {
//                                 id: item.createTime,
//                                 title: item.title,
//                                 img: item.img
//                             }
//                         })
//                         res.json({
//                             total: num[0]['COUNT(*)'],
//                             list: arr
//                         });
//                     }
//                     conn.release();
//                 })
//             }
//         });
//     })
// })

app.set('view engine','jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(api);


app.listen(1337);