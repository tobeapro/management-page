new Vue({
	el:"#app",
    data:function(){
      return {
    	userInfo:"", 
        userInfoEdit:"",
	    fullscreenLoading:false,
	    activeName: 'first',
	    isActive:true,
	    dataStatus:true,
	    limitStatus:true,
	    origPwd:'',
	    origPwdErrorStatus:false,
	    origPwdErrorText:"",
	    newPwd:'',
	    newPwdErrorStatus:false,
	    newPwdErrorText:"",
	    cfmPwd:'',
	    cfmPwdErrorStatus:false,
	    cfmPwdErrorText:"",
	    requsetStatus:true,
	    requsetInfo:'',
	    tableData:[],
	    applyData:[],	
	    dialogImageUrl: '',
        dialogVisible: false
      }
    },
    mounted:function(){
    	var _this=this;
    	_this.fullscreenLoading=true;
    	axios.get('data.json') //登录请求数据
    	.then(function(res){
    		if(res.data.status===0){   			    		
			    _this.tableData=res.data.tableData;
			    _this.userInfo=res.data.userInfo;
			    axios.get("data3.json") //判断是否要申请系统
			    .then(function(res){
			    	if(res.data.status===0){
			    	_this.applyData=res.data.data;
			    	for(var i=0;i<_this.applyData.length;i++){
			    		if(_this.applyData[i].type==="img"){
			    			_this.applyData[i].content=_this.uploadImgUrl=[];
			    		}else if(_this.applyData[i].type==="radio"){
			    			_this.applyData[i].content=false;
			    		}else{
			    			_this.applyData[i].content="";
			    		}			    		
			    	}
			    	_this.isActive=false;
			    	_this.requsetStatus=false;
			    	_this.limitStatus=false;
					_this.fullscreenLoading=false;
			    	}
			    })
			    .catch(function(res){		    	
			    	_this.fullscreenLoading=false;
			    	_this.isActive=false;
			    	_this.requsetStatus=false;
			    	_this.limitStatus=false;
			    })
		    }else{
		    	_this.fullscreenLoading=false;
		    	_this.$message.error('请求失败');
		    }
		})
    	.catch(function(res){
    		_this.fullscreenLoading=false;
		    _this.$message.error('请求失败');
    	})
  	
    },
    methods:{
    	changeStatus:function(status){
    		status===true?true:this.isActive=!this.isActive;		    	
    	},
    	saveUserInfo:function(){
    		var _this=this;
    		_this.fullscreenLoading=true;
    		var data=_this.userInfoEdit;
    		axios.post('/user/updateUserInfo',data)
    		.then(function(res){
    			if(res.data.status===0){
    				_this.dataStatus=!_this.dataStatus;
    				_this.userInfo=data;
    				_this.fullscreenLoading=false;
    				_this.$message.success('修改成功');
    			}else{
    				_this.fullscreenLoading=false;
    				_this.$message.error('修改失败');
    			}
    		})
    		.catch(function(res){
    			_this.fullscreenLoading=false;
    			_this.$message.error('修改失败');
    		})
    	},
    	editUserInfo:function(){
    		var _this=this;
    		_this.fullscreenLoading=true;		
    		axios.get('data2.json')
    		.then(function(res){
    			if(res.data.status===0){
    			_this.dataStatus=!_this.dataStatus;	
			    _this.userInfoEdit=res.data.userInfo;
			    _this.fullscreenLoading=false;
			    }else{
			    	_this.fullscreenLoading=false;
			    	_this.$message.error('编辑请求失败');
			    }
			  })
    		.catch(function(res){
    			_this.fullscreenLoading=false;
    			_this.$message.error('编辑请求失败');
    		})
    	},
    	savePwd:function(){
    		var _this=this;
    		if(_this.origPwd===""){
    			_this.origPwdErrorStatus=true;
    			_this.origPwdErrorText="请输入原密码";
    			return;
    		}
    		if(_this.newPwd===""){
    			_this.newPwdErrorStatus=true;
    			_this.newPwdErrorText="请输入新密码";
    			return;
    		}
    		if(_this.newPwd.length<6){
    			_this.newPwdErrorStatus=true;
    			_this.newPwdErrorText="密码不能少于6位";
    			return;
    		}
    		if(_this.cfmPwd===""){
    			_this.cfmPwdErrorStatus=true;
    			_this.cfmPwdErrorText="请输入确认密码";
    			return;
    		}
    		if(_this.newPwd===_this.origPwd){
    			_this.$message.error('新密码和原密码不能相同');
    			return;
    		}
    		if(_this.newPwd!==_this.cfmPwd){
    			_this.$message.error('新密码和确认密码不一致');
    			return;
    		}
    		_this.fullscreenLoading=true;
    		var data=new URLSearchParams();
    		data.append("oldPassword",_this.origPwd);
    		data.append("newPassword",_this.newPwd);
    		axios.post('/updatePwd',data)
    		.then(function(res){
    			if(res.data.status===0){
    				_this.fullscreenLoading=false;
    				_this.$message.success('修改成功');
    				_this.activeName='first';
		    		_this.dataStatus=true;
		    		_this.origPwd='';
		         	_this.newPwd='';
		         	_this.cfmPwd='';  				
    			}else{
    				_this.fullscreenLoading=false;
    				_this.$message.error('修改失败');
    			}
    		})
    		.catch(function(res){
    			_this.fullscreenLoading=false;
    			_this.$message.error('修改失败');
    		})
    	},
    	cancelPwd:function(){
    		this.activeName='first';
    		this.dataStatus=true;
    		this.origPwd='';
         	this.newPwd='';
         	this.cfmPwd='';
    	},
    	handleRemove:function(file, fileList) {
    		var url=file.url;
    		var urlArray=this.uploadImgUrl;
    		for(var i=0;i<urlArray.length;i++){
    			if(urlArray[i]===url){
    				urlArray.splice(i,1);
    				break
    			}else{
    				continue
    			}
    		}
	        console.log(file, fileList);
	    },
	    handlePictureCardPreview:function(file) {
        	this.dialogImageUrl = file.url;
        	this.dialogVisible = true;
      	},
      	handleSuccess:function(response, file, fileList){
      		console.log(file.url)
      		this.uploadImgUrl.push(file.url)
      	},
	    handleFail:function(err, file, fileList){
	    	this.$message.error('上传失败');
	      	console.log(err, file, fileList)
	    },
	    saveApplyData:function(){
    		var _this=this;
    		function trim(str){
　　     			return str.replace(/(^\s*)|(\s*$)/g, "");
　　			 }
    		for(var i=0;i<_this.applyData.length;i++){
    			if(_this.applyData[i].type==="input"&&trim(_this.applyData[i].content)===""&&_this.applyData[i].column!=="introduce"){
    				_this.$message.error('请补充相关信息');
    				return
    			}else if(_this.applyData[i].type==="img"&&_this.applyData[i].content.length===0){
    				_this.$message.error('请上传营业执照');
    				return
    			}else{
    				continue
    			}
    		}
    		var data=_this.applyData;
    		_this.fullscreenLoading=true;
    		axios.post('/apply/queryAllApplyPermission',data)
    		.then(function(res){
    			if(res.data.status===0){
    				_this.isActive=false;
			    	_this.requsetStatus=false;
			    	_this.limitStatus=false;
    				_this.fullscreenLoading=false;
    				_this.$message.success('申请已提交');	
    			}else{
    				_this.fullscreenLoading=false;
    				_this.$message.error('提交失败');
    			}
    		})
    		.catch(function(res){
    			_this.fullscreenLoading=false;
    			_this.$message.error('提交失败');
    		})
    	},
    	// 查看历史申请单详情
    	checkRequsetNote:function(val){
    		var _this=this;
    		_this.fullscreenLoading=true;
    		var data=new URLSearchParams();
    		data.append("applyOrderNum",val);
    		axios.get('data6.json')
    		.then(function(res){
    			if(res.data.status===0){
    				_this.requsetInfo=res.data.data;
    				_this.requsetStatus=!_this.requsetStatus;
    				_this.fullscreenLoading=false;
    			}else{
    				_this.fullscreenLoading=false;
    				_this.$message.error("查看失败");			
    			}
    		})
    		.catch(function(res){
  				_this.fullscreenLoading=false;
 				_this.$message.error("查看失败");		
    		})
    	}			    	
    },
    filters:{
    	infoFilter:function(name){
    		switch(name){
    			case "userName":return "用户名";
    			break;
    			case "mobliePhone":return "手机";
    			break;
    			case "email":return "邮箱";
    			break;
    			case "companyName":return "企业";
    			break;
    			case "city":return "所在地";
    			break;
    			case "address":return "地址";
    			break;
    			case "contactPeople":return "联系人";
    			break;
    			case "contactTel":return "联系电话";
    			break;
    			case "businessNumber":return "企业编号";
    			break;
    			default:return name;
    		}
    	},
    	limitCheck:function(e){
    		if(e===0){
    			return "申请中"
    		}else if(e===1){
    			return "已通过"
    		}else{
    			return "未通过"
    		}
    	},
    	contentCheck:function(e){
    		if(e===''||e===undefined||e===null){
    			return "无"
    		}else{
    			return e
    		}
    	},
    },
    watch:{
    	origPwd:function(){
    		this.origPwdErrorStatus=false;
    	},
    	newPwd:function(){
    		this.newPwdErrorStatus=false;
    	},
    	cfmPwd:function(){
    		this.cfmPwdErrorStatus=false;
    	}
    }
})

