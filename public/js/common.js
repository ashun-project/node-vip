var userCont = '<div class="modal my-login"><span class="close" onclick="closeModal()">X</span><div class="modal-body"><form action="" id="login-form"><input type="text" name="userName" placeholder="用户名"> <input type="password" name="password" placeholder="密码"></form></div><div class="modal-foot"><button>登&nbsp;&nbsp;&nbsp;录</button><p><font color="red">还没有账号吗？</font><span onclick="showMOdel(&quot;register&quot;)"><font color="#1ab394">去注册</font></span></p></div></div><div class="modal my-register"><span class="close" onclick="closeModal()">X</span><div class="modal-body"><form action="" id="register-form"><input type="text" name="userName" placeholder="用户名"> <input type="password" name="password" placeholder="密码"> <input type="password" name="vaidPassword" placeholder="确认密码"></form></div><div class="modal-foot"><button>注&nbsp;&nbsp;&nbsp;册</button><p><font color="red">已有账号吗？</font><span onclick="showMOdel(&quot;login&quot;)"><font color="#1ab394">去登入</font></span></p></div></div>';
var mask = document.getElementById('mask');
// 判断是否为登入状态
mask.innerHTML = userCont;
mask.addEventListener('click', closeModal);

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