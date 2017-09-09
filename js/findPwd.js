new Vue({
	el:"#app",
    data:function(){
      return {
      	active: 0,
        radio: '1',
        way:true, 
      	tel:"",
      	imgVer:"",
      	imgUrl:"/accountPwd/code",
      	dataUrl:"/accountPwd/code",
      	msgVer:"",
      	msgVerTimerText:"发送验证码",
      	msgVerTimerStatus:false,     
        phoneErrorText:"",
        phoneErrorStatus:false,
        imgVerErrorText:"",
        imgVerErrorStatus:false,
        msgVerErrorText:"",
        msgVerErrorStatus:false,
        telFindPwdStatus:false,
        newPwd:"",
        confirmPwd:"",
        pwdErrorText:"",
        pwdErrorStatus:false,
        mail:"",
        mailErrorText:"",
        mailErrorStatus:false,
        fullscreenLoading: false,     
      };
    },
    methods: {
      next:function(val){
      	if(val==="1"){
      		this.way=true;
      	}else if(val==="2"){
      		this.way=false;
      	}
        if (this.active++ > 2) this.active = 0;
      },
      prev:function(){
      	this.active--;
      },
      //图片验证码切换接口
      changeImgUrl:function(){
      	var _this=this;
      	_this.imgUrl=chgUrl(_this.dataUrl);
      	function chgUrl(url){
	        var timestamp = (new Date()).valueOf();
	        url = url + "?timestamp=" + timestamp;
	        return url;
	    }
      },
      //发送短信接口
      sendVerCode:function(){
      	var _this=this;
      	var check =/^1(3|4|5|7|8)\d{9}$/; 
      	if(!check.test(_this.tel)){
      		_this.phoneErrorText="请输入正确的手机号";
      		_this.phoneErrorStatus=true;
      		return;
      	}else{
      		_this.msgVerTimerStatus=true;
      		var data={"phone":_this.tel};
      		axios.post("/accountPwd/checkPhone",data)
      		.then(function(res){
      			if(res.status===0){
      				_this.phoneErrorStatus=false;
      				var time=60;
			      	_this.msgVerTimerText=time+"秒";
			      	var timer=setInterval(vTimer,1000)
			      	function vTimer(){
			      		time--;
						_this.msgVerTimerText=time+"秒";				
						if(time<=0){
							clearInterval(timer);
							_this.msgVerTimerText="发送验证码";
							_this.msgVerTimerStatus=false;
						}
			      	} 
			      	vTimer();
      			}else{
      				_this.$message.error('发送失败');
      				_this.msgVerTimerStatus=false;
      			}
      		})
      		.catch(function(err){
      			_this.$message.error('发送失败');
      			_this.msgVerTimerStatus=false;
      		})	      	
	      }
      	},
      //校验短信验证接口
      telFindPwd:function(){
      	var _this=this;   	      			
      	if(_this.phoneErrorStatus===true||_this.msgVerErrorStatus===true||_this.imgVerErrorStatus===true){
      		return
      	}
      	var check =/^1(3|4|5|7|8)\d{9}$/; 
      	if(!check.test(_this.tel)){
      		_this.phoneErrorText="请输入正确的手机号";
      		_this.phoneErrorStatus=true;
      		return
      	}
      	if(_this.imgVer.length!=4){
      		_this.imgVerErrorText="请输入正确的验证码";
      		_this.imgVerErrorStatus=true;
      		return
      	}
      	var check2=/^\d+$/;
      	if(!check2.test(_this.msgVer)||_this.msgVer.length!=6){
      		_this.msgVerErrorText="请输入正确的验证码";
      		_this.msgVerErrorStatus=true;
      		return
      	}
      	_this.fullscreenLoading=true;
      	var data={"phone":_this.tel,"code":_this.imgVer,"authCode":_this.msgVer}
   		axios.post("/accountPwd/checkSmsCode",data)
   		.then(function(res){
   			if(res.status===0){
   				_this.fullscreenLoading=false;
   				_this.next()
   			}else{
   				_this.fullscreenLoading=false;
   				_this.$message.error('手机号或验证码有误');
   			}
   		})
   		.catch(function(err){
 			_this.fullscreenLoading=false;
   			_this.$message.error('手机号或验证码有误');
		});
     },
      //手机重置密码接口
      msgConfirmPwd:function(){
      	var _this=this;
      	if(_this.newPwd.length<6){
			_this.pwdErrorText="密码长度要大于6";
			_this.pwdErrorStatus=true;
			return
		}
		if(_this.newPwd!==_this.confirmPwd){
			_this.pwdErrorText="两次输入密码不一致";
			_this.pwdErrorStatus=true;
			return
		}
		_this.fullscreenLoading=true;
		var data={"password":_this.newPwd}
		axios.post("/accountPwd/resetPwdByPhone",data)
		.then(function(res){
			if(res.status===0){
				_this.fullscreenLoading=false;
				_this.active++;
				return
			}else{
				_this.fullscreenLoading=false;
   				_this.$message.error('修改失败');
				return	
			}
		})
		.catch(function(err){;
			_this.fullscreenLoading=false;
   			_this.$message.error('修改失败');
			return				
		})
      },
       //发送邮件接口
      sendVerMail:function(){
      	var _this=this;
      	var check=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      	if(!check.test(_this.mail)){
      		_this.mailErrorText="请输入正确的邮箱";
      		_this.mailErrorStatus=true;
      		return
      	}
      	_this.fullscreenLoading=true;
      	var data={"email":_this.mail};
      	axios.post("/accountPwd/sendMail",data)
      	.then(function(res){
      		if(res.status===0){
   				_this.next()
   			}else{
   			_this.fullscreenLoading=false;
   			_this.$message.error('修改失败');
      		return
   			}
   		})
   		.catch(function(err){
   			_this.fullscreenLoading=false;
   			_this.$message.error('修改失败');
      		return
   		})
      }
    },
    watch:{
    	tel:function(){
    		this.phoneErrorStatus=false;
    	},
    	imgVer:function(){
    		this.imgVerErrorStatus=false;
    	},
    	msgVer:function(){
    		this.msgVerErrorStatus=false;
    	},
    	mail:function(){
    		this.mailErrorStatus=false;
    	},
    	newPwd:function(){
    		this.pwdErrorStatus=false;
    	},
    	confirmPwd:function(){
    		this.pwdErrorStatus=false;
    	}
    }
 })
