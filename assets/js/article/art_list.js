$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }



    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求的参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示两条
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }

    initTable()
    initCate()

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //使用模板引擎渲染页面数据
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //调用模板引擎渲染分类的可选项
                console.log(res);
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            //为查询参数对象q中对应属性赋值
        q.cate_id = cate_id
        q.state = state
            //根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数。
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换是，触发jump回调函数
            jump: function(obj, first) {
                console.log(first);
                //最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    //根据最新的q获取最新的数据列表并渲染表格
                    //根据first值判断是渲染列表导致的jump回调，还是点击分页导致的jump回调
                if (!first) {
                    initTable()
                }
            }
        });
    }

    //给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            //获取删除按钮的个数
        var len = $('.btn-delete').length
            //询问用户是否确认要删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                        //当数据删除完成后，要判断当前页面是否还有剩余数据，若没有数据了，则让页码值-1之后重新调用initTable()函数
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})