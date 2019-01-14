// ajax
function ajax() {  
    var ajaxData = {    
        type: arguments[0].type || "GET",
            url: arguments[0].url || "",
            async: arguments[0].async || "true",
            data: arguments[0].data || null,
            dataType: arguments[0].dataType || "text",
            contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
            beforeSend: arguments[0].beforeSend || function () {},
            success: arguments[0].success || function () {},
            error: arguments[0].error || function () {}  
    }; 
    ajaxData.beforeSend(); 
    var xhr = createxmlHttpRequest();
    try{
        xhr.responseType = ajaxData.dataType;  
    }catch (err) {
        console.log(err)
    };
    xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);   
    xhr.setRequestHeader("Content-Type", ajaxData.contentType);   
    xhr.send(convertData(ajaxData.data));   
    xhr.onreadystatechange = function () {     
        if (xhr.readyState == 4) {       
            if (xhr.status == 200) {
                ajaxData.success(xhr.response);      
            } else {        
                ajaxData.error();      
            }     
        }  
    } 
};
function createxmlHttpRequest() {   
    if (window.ActiveXObject) {     
        return new ActiveXObject("Microsoft.XMLHTTP");   
    } else if (window.XMLHttpRequest) {     
        return new XMLHttpRequest();   
    } 
}; 
function convertData(data) {  
    if (typeof data === 'object') {    
        var convertResult = "";     
        for (var c in data) {       
            convertResult += c + "=" + data[c] + "&";     
        }     
        convertResult = convertResult.substring(0, convertResult.length - 1);   
        return convertResult;  
    } else {    
        return data;  
    }
};

// 内容
var userCont = '<div class="modal my-login"><span class="close" onclick="closeModal()">X</span><h6 class="modal-tite">Wellcome</h6><div class="modal-body"><form action="" id="login-form"><input type="text" name="userName" placeholder="用户名"> <input type="password" name="password" placeholder="密码"></form></div><div class="modal-foot"><button onclick="getLogin()">登&nbsp;&nbsp;&nbsp;录</button><p><font color="red">还没有账号吗？</font><span onclick="showMOdel(&quot;register&quot;)"><font color="#1ab394">去注册</font></span></p></div></div><div class="modal my-register"><span class="close" onclick="closeModal()">X</span><h6 class="modal-tite">Wellcome</h6><div class="modal-body"><form action="" id="register-form"><input type="text" name="userName" placeholder="用户名"> <input type="password" name="password" placeholder="密码"> <input type="password" name="vaidPassword" placeholder="确认密码"></form></div><div class="modal-foot"><button onclick="getRegister()">注&nbsp;&nbsp;&nbsp;册</button><p><font color="red">已有账号吗？</font><span onclick="showMOdel(&quot;login&quot;)"><font color="#1ab394">去登入</font></span></p></div></div>';
var mask = document.getElementById('mask');
// 判断是否为登入状态
if (mask) {
    mask.innerHTML = userCont;
    mask.addEventListener('click', function (e) {
        var ev = e || window.event;
        var target = ev.target || ev.srcElement;
        var id = target.getAttribute('id');
        if (id && id == 'mask') {
            closeModal();
        }
    });
}

function closeModal() {
    var modal = document.getElementsByClassName('modal');
    var myBodyer = document.getElementsByClassName('bodyer')[0];
    for (var i = 0; i < modal.length; i++) {
        modal[i].style.display = 'none';
    }
    if (myBodyer) {
        myBodyer.setAttribute('id', '');
    }
    mask.style.display = 'none';
}
function showMOdel(type) {
    var loginMOdel = document.getElementsByClassName('my-login')[0];
    var registerMOdel = document.getElementsByClassName('my-register')[0];
    var myBodyer = document.getElementsByClassName('bodyer')[0];
    if(type === 'login') {
        loginMOdel.style.display = 'block';
        registerMOdel.style.display = 'none';
    } else {
        loginMOdel.style.display = 'none';
        registerMOdel.style.display = 'block';
    }
    if (myBodyer) {
        myBodyer.setAttribute('id', 'mr-top');
    }
    continueTest();
    mask.style.display = 'block';
}
function getLogin() {
    var loginForm = document.getElementById('login-form');
    var userName = loginForm.userName.value;
    var password = loginForm.password.value;
    var obj = {userName: userName, password: password };
    vaidParams(obj, '/login');
}
function getRegister() {
    var registerForm = document.getElementById('register-form');
    var userName = registerForm.userName.value;
    var password = registerForm.password.value;
    var vaidPassword = registerForm.vaidPassword.value;
    if (vaidPassword !== password) {
        alert('两次密码输入不一致');
        return;
    }
    var obj = {userName: userName, password: password };
    vaidParams(obj, '/register');
}
function vaidParams(obj, url) {
    var error = '';
    for (var key in obj) {
        if (!obj[key]) {
            error = '用户或密码不能为空';
        }
        if (obj[key].length > 12) {
            error = '用户或密码不可超过12位';
        }
        if (obj[key].length < 3) {
            error = '用户或密码不可小于3位';
        }
    }
    if (error) {
        alert(error);
        return;
    }
    ajax({  
        type: "post",
        url: url,
        data: obj,
        success: function (data) {
            var result = JSON.parse(data);
            if (result.error) {
                alert(result.error);
            } else {
                location.reload();
                // console.log(result)
            }
        },
        error: function () {
            alert('系统异常，操作失败');
        }
    });
}
function outLogin () {
    ajax({  
        type: "post",
        url: '/logout',
        beforeSend: function () {},
        success: function (data) {
            location.reload();
        },
        error: function () {
            alert('系统异常，操作失败');
        }
    });
}
function getRefresh() {
    var rotation = document.getElementsByClassName('refresh')[0];
    rotation.querySelector('img').className = 'rotation';
    ajax({
        type: "post",
        url: '/refreshLogin',
        success: function (data) {
            alert('如充值3分钟后，VIP没开通的，请联系客服!(充值时要备注用户名)');
            location.reload();
        }
    });
}
function search (id) {
    var val = document.getElementById('search-value').value;
    var pathname = window.location.pathname;
    if (val) {
        window.location.href = '/1/'+val.substr(0, 10);
    } else {
        if (pathname !== '/') {
            window.location.href = '/';
        }
    }
}
function getSearchKeyup (e) {
    var event = e || window.event;
    if (event.keyCode == "13") {
        search();
    }
}

// var myiframe = document.getElementById('my-iframe');
// if (myiframe) {
//     var docum = myiframe.contentWindow.document;
//     var ev = docum.querySelector("video");
//     var width = parseInt(ev.getAttribute("width"));
//     var height = parseInt(ev.getAttribute("height")) - 50;
//     var widthcss = parseInt(ev.offsetWidth);
//     var hig = (height / width) * widthcss;
//     ev.style.height = hig+"px";
//     myiframe.style.height=hig+10+"px";
// }


var ev = document.querySelectorAll("video");
if (ev.length) {
    for(var j = 0; j < ev.length; j++) {
        var width = parseInt(ev[j].getAttribute("width"));
        var height = parseInt(ev[j].getAttribute("height")) - 50;
        var widthcss = parseInt(ev[j].offsetWidth);
        var hig = (height / width) * widthcss;
        ev[j].style.height = hig+"px";
    }
}

// 提示框
var testLook = document.getElementById('test-look');
if (testLook) {
    setTimeout(function () {
        testLook.style.zIndex = '10000';
        testLook.style.visibility = 'visible';
        testLook.style.opacity = '1';
        testLook.style.top = '100px';
    }, 1000);
}
function continueTest() {
    if (testLook) {
        testLook.style.zIndex = '-1';
        testLook.style.visibility = 'hidden';
        testLook.style.opacity = '0';
    }
}

// 公告
scrollNotice();
function scrollNotice () {
    var num = 1;
    var notice = document.getElementById('notice-cont');
    if (!notice) {
        return;
    }
    var p = notice.querySelectorAll('p');
    var np = '';
    if (p.length > 1) {
        setInterval(function () {
            notice.style.top = '-'+(25*num)+'px';
            num++;
            if ((num % p.length) === 0) {
                for (var i = 0; i < p.length; i++) {
                    np = document.createElement('p');
                    np.innerHTML = p[i].innerHTML;
                    notice.appendChild(np);
                }
            }
        }, 5000)
    }
}


//开通时间
var modalMember = document.getElementById('modal-member');
var memberParame = {};
function addTime(idx, total) {
    var money = {'1': 3.3, '7': 9.9, '30': 26, '180': 120, '360': 200};
    var userName = document.getElementById('user-name-'+idx).textContent;
    var userTime = document.getElementById('user-time-'+idx).textContent;
    var seleltTime = document.getElementById('select-time-'+idx).value;
    var time = (Number(seleltTime)+1) * 24 * 60 * 60 * 1000;
    var startTiem = new Date().getTime() + time;
    var date = '';
    if (userTime) {
        var date = userTime.replace(/-/g, '/');
        if (new Date(date).getTime() > new Date().getTime()) {
            startTiem = new Date(date).getTime() + time;
        }
    }
    date = getFormatDate(startTiem);
    memberParame = {
        endDate: date,
        total: money[seleltTime] + Number(total),
        userName: userName
    }
    modalMember.style.display = 'block';
}
function sureAddTme(cancel) {
    if (!memberParame || !memberParame.endDate) {
        alert('error');
        return;
    }
    if (cancel) {
        modalMember.style.display = 'none';
        return;
    }
    ajax({  
        type: "post",
        url: '/updateUser',
        data: memberParame,
        success: function (data) {
            var result = JSON.parse(data);
            if (result.error) {
                alert(result.error);
            } else {
                location.reload();
            }
        },
        error: function () {
            alert('系统异常，操作失败');
        }
    });
}
function getFormatDate(time) {
    var date = new Date(time);
    var str = '';
    var dateArr = [date.getFullYear(), '-', date.getMonth() + 1, '-', date.getDate()];
    dateArr.forEach(item => {
        if (typeof item === 'number' && item < 10) item = '0' + item;
        str += item;
    });
    return str;
}
function memberSearch () {
    var value = document.getElementById('member-search-value').value;
    var table = document.getElementById('my-table');
    var tr = table.querySelectorAll('tbody tr');
    for (var i = 0; i < tr.length; i++) {
        if (value) {
            if (tr[i].getAttribute('name') === value) {
                tr[i].removeAttribute('style');
            } else {
                tr[i].setAttribute('style', 'display:none');
            }
        } else {
            tr[i].removeAttribute('style');
        }
    }
}
function getKeyup(e) {
    var event = e || window.event;
    if (event.keyCode == "13") {
        memberSearch()
    }
}
// 底部
var cBody =  document.getElementsByTagName('body')[0];
var cHost = 'http://'+window.location.host;
var cHt = '<div class="kefu-cont"><strong>联系客服:</strong><img border="0" src="'+cHost+'/img/wei2.png" alt="vip微信图片" style="width:25px;"><span>13952470578</span>'+
         '<img src="http://pub.idqqimg.com/wpa/images/counseling_style_51.png" alt="vip客服qq图" class="logo_img"><a style="text-decoration:underline;" target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=2982501851&amp;site=qq&amp;menu=yes">2982501851</a></div>';
var cDiv = document.createElement('div');
cDiv.innerHTML = cHt;
cDiv.className = 'kefu';
cBody.style.paddingBottom = '40px';
cBody.appendChild(cDiv);


// var bb = localStorage.getItem('bb');
// if (!bb) {
//     alert('线路维护中请先观看普通区域。地址：xjb520.com');
//     localStorage.setItem('bb', '123');
// }