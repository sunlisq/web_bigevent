$(function() {
    //点击去注册账号的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击去登录的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    //从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
        //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义了一个叫pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            //通过形参拿到的是确认密码框的内容，还需拿到密码框内容，然后比较
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！')
                //模拟点击去登录链接
            $('#link_login').click()
        })
    })

    //监听登录表单提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单中数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功！')
                    //将登录成功得到的token字符串，保存到localstorage中
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})