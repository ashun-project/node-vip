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
mask.innerHTML = userCont;
mask.addEventListener('click', function (e) {
    var ev = e || window.event;
    var target = ev.target || ev.srcElement;
    var id = target.getAttribute('id');
    if (id && id == 'mask') {
        closeModa();
    }
});

function closeModal() {
    var modal = document.getElementsByClassName('modal');
    for (var i = 0; i < modal.length; i++) {
        modal[i].style.display = 'none';
    }
    mask.style.display = 'none';
}
function showMOdel(type) {
    var loginMOdel = document.getElementsByClassName('my-login')[0];
    var registerMOdel = document.getElementsByClassName('my-register')[0];
    if(type === 'login') {
        loginMOdel.style.display = 'block';
        registerMOdel.style.display = 'none';
    } else {
        loginMOdel.style.display = 'none';
        registerMOdel.style.display = 'block';
    }
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
                // location.reload();
                console.log(result)
            }
        },
        error: function () {
            alert('系统异常，操作失败');
        }
    });
}
















// 公告
scrollNotice();
function scrollNotice () {
    var num = 1;
    var notice = document.getElementById('notice-cont');
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
        }, 3000)
    }
}