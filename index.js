$(function(){
    var rightData = [];//用来渲染右边的数据
    var leftData = [];//用来渲染左边的数据
    var INDEX = 0;//用来记录群的索引
    var ORDER = 0;//用来记录输入的顺序
    var title = '奥体东'
    var list = [{label:'A1',content:[]},{label:'A2',content:[]}];
    // window.pasteFun = function(e){
    //     var val = $(e).val();
    //     this.console.log(val)
    //     if(val){
    //         $(e).val(val+',');
    //         // console.log(val);
    //     }
    // }
    var app = {
        init:function(){
            this.renderTab();
            this.event();
            $('.nav li').eq(0).trigger('click');
        },
        event:function(){
            var _self = this;
            $(document).on('click','.nav li',function(event){
                $(this).addClass('active').siblings().removeClass('active');
                title = $(this).find('a').text();
                INDEX = $(this).index();
                var ydLeft = localStorage.getItem('YD-left-'+INDEX)?unzip(localStorage.getItem('YD-left-'+INDEX)):'[]'
                leftData = JSON.parse(ydLeft);
                leftData = leftData&&leftData.length?leftData:list;
                var ydRight = localStorage.getItem('YD-right-'+INDEX)?unzip(localStorage.getItem('YD-right-'+INDEX)):'[]';
                rightData = JSON.parse(ydRight);
                rightData = rightData&&rightData.length?rightData:[];
                ORDER = rightData.length;
                // console.log(leftData);
                
                // if(leftData&&leftData.length){
                $('main').html(template('cont',{res:leftData}));

                $('main').find('.left .item').each(function(){
                    _self.pasteEvent($(this).find('.form-control-text').attr('id'))
                })
                $('.save-btn').trigger('click');
                // }
               
            })
            $(document).on('click','.btn-export',function(){
                var arr = [];
                $('.nav').find('li').each(function(){
                    var index = $(this).index();
                    // console.log(index);
                    var leftList = '';
                    var rightList = '';
                    leftList = localStorage.getItem('YD-left-'+index)?unzip(localStorage.getItem('YD-left-'+index)):'[]';
                    rightList = localStorage.getItem('YD-right-'+index)?unzip(localStorage.getItem('YD-right-'+index)):'[]';
                    arr.push({
                        label:'YD-left-'+index,
                        data:leftList
                    },{
                        label:'YD-right-'+index,
                        data:rightList
                    })
                })
                // console.log();
                $('#export-data').val(zip(JSON.stringify(arr)));
            })
            $(document).on('click','.btn-import',function(){
                $('#import-data').val('')
            })
            $(document).on('click','.import-sure',function(){
                var arr = $('#import-data').val();
                arr = arr?JSON.parse(unzip(arr)):[];
                console.log(arr);
                arr.map(function(item){
                    localStorage.setItem(item.label,zip(item.data));
                })

                $('#myModal1').modal('toggle');
                $('.nav li').eq(0).trigger('click');
            })
            $(document).on('click','.delete-sure',function(){
                localStorage.clear();
                $('.nav li').eq(0).trigger('click');
            })
            $(document).on('dblclick','.nav li',function(event){
                // $(this).find('input').removeClass('hidden').siblings().addClass('hidden');
                // $(this).addClass('active').siblings().removeClass('active');
                
            })
            // $(document).on('blur','.nav li input',function(){
            //     var val = $(this).val();
            //     $(this).addClass('hidden').siblings().removeClass('hidden').text(val);
            //     var data = [];
            //     $('.nav').find('li').each(function(event){
            //         var value = $(this).find('input').val();
            //         data.push(value);
            //     })
            //     localStorage.setItem('tabList',JSON.stringify(data));
            // })
            $(document).on('click','.add-item',function(event){
                var leftHtml = '<div class="item">'
                            +'<label class="form-label"><input type="text" class="form-control" value="" placeholder="请输入名称"></label>'
                            +'<div class="form-group">'
                            +'<input type="text" class="form-control form-control-text" id="" placeholder="请复制粘贴名单到此处"></input>'
                            +'</div>'
                            +'</div>'
                $('.left').append(leftHtml);
            })
            
            $(document).on('click','.delete-name',function(event){
                var order = $(this).closest('.btn').data('order');
                var name = $(this).closest('.btn').data('name');
                $(this).closest('.btn').remove();
                rightData.splice(order-1,1);
                rightData.map(function(item,index){
                    item.order = index+1
                })
                // console.log(rightData);
                $('.save-btn').trigger('click');
            })
            $(document).on('blur','.left .form-label .form-control',function(event){
                var val =$(this).val();
                if(val){
                    $(this).closest('.item').find('.form-group .form-control-text').attr('id',val);
                    _self.pasteEvent(val);
                    // rightData.push({
                    //     order:ORDER,
                    //     label:id,
                    //     value:pastedText
                    // })
                    if($(this).closest('.item').find('.form-group .btn').length){
                        $(this).closest('.item').find('.form-group .btn').each(function(){
                            var that = this;
                            rightData.map(function(item){
                                if(item.order==$(that).data('order') && item.value==$(that).data('name')){
                                    item.label = val
                                }
                            })
                        })
                    }
                    $('.save-btn').trigger('click');
                }
            })
            $(document).on('mouseenter','.left .form-group',function(){
                $(this).find('input').focus();
            })
            $(document).on('input','.left .form-group input',function(){
                var val = $(this).val();
                var label = $(this).closest('.item').find('.form-label input').val();
                if(!label){
                    return false;
                }
                if(val.charAt(val.length-1) == ','||val.charAt(val.length-1) == '，'){
                    ORDER = rightData.length+1;
                    $(this).before('<a href="javascript:;" data-order="'+ORDER+'" data-name="'+val.substr(0,val.length-1)+'" class="btn btn-default btn-xs"><span>'+ORDER+'.</span>'+val.substr(0,val.length-1)+'<i class="glyphicon glyphicon-remove delete-name"></i></a>');
                    rightData.push({
                        order:ORDER,
                        label:$(this).attr('id'),
                        value:val.substr(0,val.length-1)
                    })
                    setTimeout(() => {
                      $(this).val('');
                      $(this).focus();
                    }, 0);
                    $('.save-btn').trigger('click');
                }
            })
            $(document).on('keyup',function(e){
                if(e.keyCode == 13){
                    $('.save-btn').trigger('click');
                }
            })
            $(document).on('click','.toggle-order',function(){
                if($(this).text() == '去掉序号'){
                    $(this).text('添加序号');
                }else{
                    $(this).text('去掉序号');
                }
                $('.right .item .form-group').find('.list-text').each(function(event){
                    $(this).find('.order').toggleClass('hidden');
                })
            })
            $(document).on('click','.save-btn',function(event){
                // console.log(rightData);
                leftData = [];
                $('main .left').find('.item').each(function(e){
                    var that = this;
                    leftData.push({
                        label:$(that).find('.form-label .form-control').val(),
                        content:[]
                    })
                })
                leftData.map(function(item){
                    rightData.map(function(item1){
                        if(item1.label == item.label){
                            item.content.push(item1)
                        }
                    })
                })
                $('main').html(template('cont',{res:leftData}));
                $('main').find('.left .item').each(function(){
                    _self.pasteEvent($(this).find('.form-control-text').attr('id'));
                })
                var html = '';
                if(rightData&&rightData.length){
                    rightData.map(function(item){
                        html+='<span class="list-text">'+'<span class="order">'+item.order+'.</span><span class="text">'+item.value+'</span>&#x3000;&#x3000;'+item.label+'</span><br>'
                    //    html+=item.order+'.'+item.value+'&#x3000;&#x3000;'+item.label+'&#10;'
                    })
                }
                $('main .right').find('.item').find('.form-group').html(html);
               
                var INDEX = $('.nav').find('li.active').index();
               
               
                localStorage.setItem('YD-right-'+INDEX,zip(JSON.stringify(rightData)));
                leftData = leftData.filter(function(item){return item.content.length});
                localStorage.setItem('YD-left-'+INDEX,zip(JSON.stringify(leftData)));
                $('.total').html(template('total',{res:leftData,title:title}));
                // console.log(data);
            })
            $(document).on('click','.copy',function(){
                var text = $('.right .item .form-group').text();
                copyText(text,function(){
                    alert('aaaaaa')
                })
               
            })
            $(document).on('click',function(event){
                if($(event.target).hasClass('tab-input')){
                    return false;
                }
                $('.nav li input').addClass('hidden').siblings().removeClass('hidden');
            })
        },
        pasteEvent:function(id){
            $('#'+id).bind('paste',function(e){
                var pastedText = undefined;
                if (window.clipboardData && window.clipboardData.getData) { // IE
                    pastedText = window.clipboardData.getData('Text');
                  } else {
                    pastedText = e.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
                  }
                //   console.log(pastedText);
                  ORDER = rightData.length+1;
                  $('#'+id).before('<a href="javascript:;" data-order="'+ORDER+'" data-name="'+pastedText+'" class="btn btn-default btn-xs"><span>'+ORDER+'.</span>'+pastedText+'<i class="glyphicon glyphicon-remove delete-name"></i></a>');
                  rightData.push({
                      order:ORDER,
                      label:id,
                      value:pastedText
                  })
                  setTimeout(() => {
                    $('#'+id).val('');
                  }, 0);
                  $('.save-btn').trigger('click');
            });
        },
        renderTab:function(){
            // 修改群名称
            var arr = ['奥体东','郁金香','安德门','集庆门','雨润','苜蓿园','仙鹤门','下马坊','经天路','汉中路','龙眠'];
            // var data = JSON.parse(localStorage.getItem('tabList'));
            $('.nav').html(template('tabList',{res:arr}));
        }
    }
    function copyText(text, callback){ // text: 要复制的内容， callback: 回调
        var tag = document.createElement('input');
        tag.setAttribute('id', 'cp_hgz_input');
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById('cp_hgz_input').select();
        document.execCommand('copy');
        document.getElementById('cp_hgz_input').remove();
        if(callback) {callback(text)}
    }
     // 解压
     function unzip(b64Data) {
        let strData = atob(b64Data);
        const charData = strData.split('').map(function (x) {
            return x.charCodeAt(0);
        });
        const binData = new Uint8Array(charData);
        const data = pako.inflate(binData);
        strData = String.fromCharCode.apply(null, new Uint16Array(data));
        return decodeURIComponent(strData);
    }

    // 压缩
    function zip(str) {
        const binaryString = pako.gzip(encodeURIComponent(str), {to: 'string'})
        return btoa(binaryString);
    }
    app.init();
})