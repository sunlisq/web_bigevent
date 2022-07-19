$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    var indexAdd = null
        //为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function(e) {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //监听表单的submit事件,通过事件委托绑定
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                layer.msg('新增分类成功！')
                initArtCateList()
                    //根据索引关闭对应弹出层
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
        //通过事件委托把编辑按钮的点击事件绑定在tbody上
    $('tbody').on('click', '.btn-edit', function() {
        //弹出修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-Edit').html()
        })

        var id = $(this).attr('data-Id')

        //发起请求，获取对象分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //加载已有信息
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过事件委托把修改分类表单的提交事件绑定在body上
    $('body').on('submit', '#form-Edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function(e) {
        var id = $(this).attr('data-id')
            //提示用户是否确定要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    layer.close(index);
                    initArtCateList()
                }
            })
        });
    })
})