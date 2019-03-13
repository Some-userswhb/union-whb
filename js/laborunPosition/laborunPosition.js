
var Custom = function () {

    var initPickers = function () {

    }
    var handleRecords = function () {

        var tbs=$('.dataTables-example').dataTable({
            sDom: '"top"i',   //去掉搜索框方法二：这种方法可以，动态获取数据时会引起错误
            ordering: false,
            bLengthChange: false,   //去掉每页显示多少条数据方法
            language: lang,  //提示信息
            autoWidth: true,  //禁用自动调整列宽
            stripeClasses: ["odd", "even"],  //为奇偶行加上样式，兼容不支持CSS伪类的场合
            processing: true,  //隐藏加载提示,自行处理
            serverSide: true,  //启用服务器端分页
            searching: false,  //禁用原生搜索
            orderMulti: false,  //启用多列排序
            order: [],  //取消默认排序查询,否则复选框一列会出现小箭头
            renderer: "bootstrap",  //渲染样式：Bootstrap和jquery-ui
            pagingType: "full_numbers",  //分页样式：simple,simple_numbers,full,full_numbers
            columnDefs: [{
                "targets": 'nosort',  //列的样式名
                "orderable": false    //包含上样式名‘nosort’的禁止排序
            }],
            ajax: function (data, callback, settings) {
                //封装请求参数
                var param = {};
                param.size = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
                param.page = (data.start / data.length) + 1;//当前页码
                //ajax请求数据
                $.ajax({
                    type: "post",
                    url: baseUrl+"/laborunPosition/queryPage",
                    cache: false,  //禁用缓存
                    data: JSON.stringify(param),  //传入组装的参数
                    dataType: "json",
                    contentType: "application/json",
                    success: function (result) {
                        console.log(result);
                        //封装返回数据
                        var returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.data.total;//返回数据全部记录
                        returnData.recordsFiltered = result.data.total;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.data.content;//返回的数据列表
                        console.log(returnData);
                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                        callback(returnData);
                        $('.i-checks').iCheck({
                            checkboxClass: 'icheckbox_square-green',
                            radioClass: 'iradio_square-green',
                        });
                        $('select').comboSelect();
                        $(".allCheck").on('ifChanged', function (event) {
//                            console.log($(this));
                            var selectThis = $(this).parents('label').nextAll().find('input[type=checkbox]');
//                            console.log(selectThis);
                            selectThis.prop("checked", $(this).prop("checked"));
                            if ($(this)[0].checked) {
                                selectThis.parent().addClass("checked");
                            } else {
                                selectThis.parent().removeClass("checked");
                            }
                        });
                        //        列表全选功能
                        $(".allCheckList").on('ifChanged', function (event) {
//                            console.log($(this));
                            var selectThis = $(this).parents('thead').next('tbody').find('input[type=checkbox]');
//                            console.log(selectThis);
                            selectThis.prop("checked", $(this).prop("checked"));
                            if ($(this)[0].checked) {
                                selectThis.parent().addClass("checked");
                            } else {
                                selectThis.parent().removeClass("checked");
                            }
                        });
                        $('.dataTables-example tr td:first-child').css({"text-align": 'left'});
                        $('.dataTables-example tr th:first-child').css({"text-align": 'left'});
                    }
                });
            },
            columns: [
                {
                    "render": function () {
                        return '<input type="checkbox" class="i-checks iCheck-helper" name="input[]">';
                    },
                    "bSortable": false
                },
                {"data": "laborunName"},
                {"data": "positionName"},
                {
                    "render": function () {
                        return ' <button type="button" class="btn  btn-primary">查看</button> <button type="button" class="btn  btn-primary">编辑 </button>';
                    },
                    "bSortable": false
                },
            ]
        }).api();//此处需调用api()方法,否则返回的是JQuery对象而不是DataTables的API对象

        $('#nameselect').on('click', '.table-action-submit', function(e) {
            e.preventDefault();
            tbs.ajax.reload();
        });
        $('#nameselect').on('click', '.table-action-cancel', function(e) {
            e.preventDefault();
            tbs.ajax.reload();
        });
    }
    return {
        init: function () {
            initPickers();
            handleRecords();
        }
    };

}();

$(function() {
    Custom.init();
});