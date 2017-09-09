 new Vue({
	      el: '#app',
	      data: function() {
	        return { 
	        	checked: false,
	        	userInfo:{
	        		userName:"",
	        		mobile:"",
	        		msgVer:"",
	        		mail:"",
	        		pwd:"",
	        		cfmPwd:""
	        	},
	        	msgVerTimerText:"发送验证码",
      			msgVerTimerStatus:false,  
	        	userErrorStatus:false,
	        	userErrorText:'',
	        	mobileErrorStatus:false,
	        	mobileErrorText:'',
	        	msgVerErrorStatus:false,
	        	msgVerErrorText:'',
	        	mailErrorStatus:false,
	        	mailErrorText:'',
	        	pwdErrorStatus:false,
	        	pwdErrorText:'',
	        	cfmPwdErrorStatus:false,
	        	cfmPwdErrorText:'',
	        	fullscreenLoading:false,
	        	registerStatus:false,
	        }
	      },
	      methods:{
	      	sendMsgVer:function(){
		      	var _this=this;
		      	var check =/^1(3|4|5|7|8)\d{9}$/; 
		      	if(!check.test(_this.userInfo.mobile)){
		      		_this.mobileErrorText="请输入正确的手机号";
		      		_this.mobileErrorStatus=true;
		      		return;
		      	}else{
		      		_this.msgVerTimerStatus=true;
		      		var data={"phone":_this.userInfo.mobile};
		      		axios.post("/accountPwd/checkPhone",data)
		      		.then(function(res){
		      			if(res.status===0){
		      				_this.mobileErrorStatus=false;
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
	      	trim:function(str){
　　     			return str.replace(/(^\s*)|(\s*$)/g, "");
　　			},
 			//  失焦检测
 			nameBlur:function(){
 				var _this=this
 				var userName=_this.trim(_this.userInfo.userName);
				if(userName===""){
					return
				}
 				var data=new URLSearchParams();
 				data.append("userName",userName);
 				axios.post("/url",data)
 				.then(function(res){
 					if(res.data.status===0){
 						_this.userErrorStatus=true;
	      				_this.userErrorText="该用户名已被注册";
 					}else{
 						return
 					}
 				})
 				.catch(function(res){
 					return
 				})
 			},
 			mailBlur:function(){
 				var _this=this
 				var mail=_this.userInfo.mail;
				var check3=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		      	if(!check3.test(mail)){
		      		return
		      	}
 				var data=new URLSearchParams();
 				data.append("mail",mail);
 				axios.post("/url",data)
 				.then(function(res){
 					if(res.data.status===0){
 						_this.userErrorStatus=true;
	      				_this.userErrorText="该邮箱已被注册";
 					}else{
 						return
 					}
 				})
 				.catch(function(res){
 					return
 				})
 			},
 			mobileBlur:function(){
 				var _this=this;
 				var mobile=_this.userInfo.mobile;
				var check =/^1(3|4|5|7|8)\d{9}$/; 
		      	if(!check.test(mobile)){
		      		return;
		      	}
 				var data=new URLSearchParams();
 				data.append("phone",mobile);
 				axios.post("/url",data)
 				.then(function(res){
 					if(res.data.status===0){
 						_this.mobileErrorStatus=true;
	      				_this.mobilerErrorText="该手机号已被注册";
 					}else{
 						return
 					}
 				})
 				.catch(function(res){
 					return
 				})
 			},
			//	提交注册信息
	      	registerUser:function(){
	      		var _this=this;
	      		if(_this.userErrorStatus===true||_this.mobileErrorStatus===true||_this.msgVerErrorStatus===true||_this.mailErrorStatus===true||_this.pwdErrorStatus===true||_this.cfmPwdErrorStatus===true){
	      			return
	      		}
	      		if(_this.trim(_this.userInfo.userName)===""){
	      			_this.userErrorStatus=true;
	      			_this.userErrorText="用户名不能为空";
	      			return
	      		}
	      		var check3=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		      	if(!check3.test(_this.userInfo.mail)){
		      		_this.mailErrorText="请输入正确的邮箱号";
		      		_this.mailErrorStatus=true;
		      		return
		      	}
	      		if(_this.trim(_this.userInfo.mobile)===""){
	      			_this.mobileErrorStatus=true;
	      			_this.mobileErrorText="请输入手机号";
	      			return
	      		}
	      		var check =/^1(3|4|5|7|8)\d{9}$/; 
		      	if(!check.test(_this.userInfo.mobile)){
		      		_this.mobileErrorText="请输入正确的手机号";
		      		_this.mobileErrorStatus=true;
		      		return
		      	}		      	
		      	if(_this.trim(_this.userInfo.msgVer)===""){
		      		_this.msgVerErrorText="请输入验证码";
		      		_this.msgVerErrorStatus=true;
		      		return
		      	}
		      	var check2=/^\d+$/;
		      	if(!check2.test(_this.userInfo.msgVer)||_this.userInfo.msgVer.length!==6){
		      		_this.msgVerErrorText="请输入正确的验证码";
		      		_this.msgVerErrorStatus=true;
		      		return
		      	}
		      	if(_this.userInfo.pwd===""){
	      			_this.pwdErrorStatus=true;
	      			_this.pwdErrorText="请输入注册密码";
	      			return
	      		}
		      	if(_this.userInfo.pwd.length<6){
	      			_this.pwdErrorStatus=true;
	      			_this.pwdErrorText="密码不小于6位";
	      			return
	      		}
		      	if(_this.userInfo.cfmPwd===""){
	      			_this.cfmPwdErrorStatus=true;
	      			_this.cfmPwdErrorText="请输入确认密码";
	      			return
	      		}
		      	if(_this.userInfo.pwd!==_this.userInfo.cfmPwd){
	      			_this.pwdErrorStatus=true;
	      			_this.pwdErrorText="两次密码输入不一致";
	      			return
	      		}
		      	_this.fullscreenLoading=true;
		      	var data={"userName":_this.trim(_this.userInfo.userName),"phone":_this.userInfo.mobile,"msgVer":_this.userInfo.msgVer,"mail":_this.userInfo.mail,"password":_this.userInfo.pwd};
		      	axios.post('/url',data)
		      	.then(function(res){
		      		if(res.data.status===0){
		      			_this.fullscreenLoading=false;
		      			_this.registerStatus=true;
		      			_this.$message.success('注册成功');
		      		}else{
		      			_this.fullscreenLoading=false;
		      			_this.$message.error('注册失败');
		      		}
		      	})
		      	.catch(function(res){
		      		_this.fullscreenLoading=false;
		      		_this.$message.error('注册失败');
		      	})
	      	}
	      },
	      watch:{
	      	"userInfo.userName":function(){
	      		this.userErrorStatus=false;
	      	},
    		"userInfo.mobile":function(){
    			this.mobileErrorStatus=false;
    		},
    		"userInfo.msgVer":function(){
    			this.msgVerErrorStatus=false;
    		},
    		"userInfo.mail":function(){
    			this.mailErrorStatus=false;
    		},
    		"userInfo.pwd":function(){
    			this.pwdErrorStatus=false;
    		},
    		"userInfo.cfmPwd":function(){
    			this.pwdErrorStatus=false;
    			this.cfmPwdErrorStatus=false;
    		}
	      }
	    })
