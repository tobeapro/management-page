$(function(){
	$("#login_tab").on("click",".el-tabs__item",function(){
		var _this=$(this);
		var index=_this.index();
		var le=$("#login_tab").find(".el-tabs__item");
		var name=_this.attr("name")
		if(_this.hasClass("is-active")){
			return
		}else{
			_this.addClass("is-active").siblings().removeClass("is-active");
			var wd=parseFloat(_this.css("width"));
			var lf=0;
			if(index===1){
				lf=0;
			}else{
			for(var i=0;i<index-1;i++){
				lf+=parseFloat($("#login_tab").find(".el-tabs__item").eq(index-2).css("width"))
				}
			}
			$(".el-tabs__active-bar").css({"width":wd,"transform":"translateX("+lf+"px)"})
			$(".login_frame_item[name="+name+"]").addClass("active").siblings(".login_frame_item").removeClass("active");
		}
	})
//轮播切换
	var index=0;
	var autoTime=null;
	var autoFocus=function(){
		autoTime=setInterval(function(){
			index===3?index=0:index++;
			$("#focus_point_part").find(".focus_point_button").eq(index).click();
		},2000)
	}
	autoFocus();
	$("#focus_point_part").on("click",".focus_point_button",function(){
		index=$(this).index();
		var fi=$("#focus_part").find(".focus_img");
		$(this).addClass("active").siblings().removeClass("active");
		fi.eq(index).addClass("active").siblings(".focus_img").removeClass("active");
	})	
	$("#focus_part").on("mouseenter",".focus_img,.focus_point_button",function(){
		clearInterval(autoTime);
	}).on("mouseleave",".focus_img,.focus_point_button",function(){
		autoFocus();
	})
})
//登录
$("#login_btn").click(function(){
	var _this=$(this);
	var lWay=$(".login_frame_item.active").attr("name");
	var submitContent;
	if(lWay==="psd"){
		//密码登录
		var aI=$("#login_act");
		var pI=$("#login_psd");
		var act=aI.val();
		var psd=pI.val();
		if($.trim(act)===""||$.trim(act)===undefined){
			if(aI.hasClass("has-error")){
				aI.next(".has-error-text").text("请输入登录账号");
				return
			}else{
				aI.addClass("has-error").after("<span class='has-error-text'>请输入登录账号</span>");
				return
			}			
		}
		if($.trim(psd)===""||$.trim(psd)===undefined){
			if(pI.hasClass("has-error")){
				pI.next(".has-error-text").text("请输入密码");
				return
			}else{
				pI.addClass("has-error").after("<span class='has-error-text'>请输入密码</span>");
				return
			}		
		}
		_this.attr("disabled",true)
		submitContent={"userName":act,"password":psd};//账号密码登录
		$.ajax({
			type:"post",
			url:"",
			data:submitContent,
			success:function(){
				_this.attr("disabled",false);
			},
			error:function(){
				_this.attr("disabled",false);
			}
		})
	}else if(lWay==="ver"){
		//验证码登录
		var mI=$("#login_mobile");
		var vI=$("#login_ver");
		var mobile=mI.val();
		var ver=vI.val();
		if($.trim(mobile)===""||$.trim(mobile)===undefined){
			if(mI.hasClass("has-error")){
				mI.next(".has-error-text").text("请输入手机号");
				return
			}else{
				mI.addClass("has-error").after("<span class='has-error-text'>请输入手机号</span>");
				return
			}
		}
		if($.trim(ver)===""||$.trim(ver)===undefined){
			if(vI.hasClass("has-error")){
				vI.next(".has-error-text").text("请输入验证码");
				return
			}else{
				vI.addClass("has-error").after("<span class='has-error-text'>请输入验证码</span>");
				return
			}
		}
		var check =/^1(3|4|5|7|8)\d{9}$/; 
		if(!check.test(mobile)){
			if(mI.hasClass("has-error")){
				mI.next(".has-error-text").text("请输入正确的手机号");
				return
			}else{
				mI.addClass("has-error").after("<span class='has-error-text'>请输入正确的手机号</span>");
				return
			}
		}
		_this.attr("disabled",true);
		submitContent={"phone":mobile,"authCode":ver};//短信验证码提交
		$.ajax({
			type:"post",
			url:"",
			data:submitContent,
			success:function(){
				_this.attr("disabled",false);
			},
			error:function(){
				_this.attr("disabled",false);
			}
		})
	}else{
		return
	}
})
//输入框移除提示警告
$(".el-input__inner").keydown(function(){
	if($(this).hasClass("has-error")){
		$(this).removeClass("has-error").next(".has-error-text").remove();
	}
})
//获取验证码
$("#ver_button").click(function(){
	var _this=$(this);
	var mI=$("#login_mobile");
	var mobile=mI.val();
	_this.attr("disabled",true);
	if($.trim(mobile)===""||$.trim(mobile)===undefined){
		if(mI.hasClass("has-error")){
			mI.next(".has-error-text").text("请输入手机号");
			_this.attr("disabled",false);
			return
		}else{
			mI.addClass("has-error").after("<span class='has-error-text'>请输入手机号</span>");
			_this.attr("disabled",false);
			return
		}
	}
	var check =/^1(3|4|5|7|8)\d{9}$/; 
	if(!check.test(mobile)){
		if(mI.hasClass("has-error")){
			mI.next(".has-error-text").text("请输入正确的手机号");
			_this.attr("disabled",false);
			return
		}else{
			mI.addClass("has-error").after("<span class='has-error-text'>请输入正确的手机号</span>");
			_this.attr("disabled",false);
			return
		}
	}
	var submitNum={"phone":mobile}
	$.ajax({
		type:"post",
		url:"",
		data:submitNum,
		success:function(){
			var time=60;
			var timer=setInterval(function(){
				time--;
				_this.text(time+"秒");				
				if(time<=0){
					clearInterval(timer);
					_this.text("发送验证码").attr("disabled",false);
				}
			},1000)
		},
		error:function(){
			var time=60;
			var timer=setInterval(function(){
				time--;
				_this.text(time+"秒");				
				if(time<=0){
					clearInterval(timer);
					_this.text("发送验证码").attr("disabled",false);
				}
			},1000)
		}
	})
})
