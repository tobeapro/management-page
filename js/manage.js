new Vue({
	el:"#app",
    data:function(){
      return {
      	isActive:true,
      	requsetStatus:true,
      	sysStatus:true,
      	sysHandleStatus:true,
      	fullscreenLoading:false,
      	screenLoading:false,
      	modalLoading:false,
      	tableData:[],   	
    	newName:'',
    	newCode:'',
    	newStatus:false,
    	newRemark:'',
    	oldId:'',
    	oldName:'',
    	oldCode:'',
    	oldStatus:false,
    	oldRemark:'',
    	applyData:[],
    	applyDetailInfo:'',
    	childSysInfo:[],
    	applyNumber:'',
    	auditNum:1,
    	auditText:'',
    	dialogFormVisible: false,
	    formLabelWidth: '120px'
    	}
    },
    beforeCreate:function(){
    	var _this=this;
    	axios.get("data4.json")
    	.then(function(res){
    		if(res.data.status===0){
    		_this.tableData=res.data.data;
    		}else{
    			_this.$message.error("请求失败")
    		}
    	})
    	.catch(function(res){
    		_this.$message.error("请求失败")
    	})
    },
    methods:{
    	changeStatus:function(status){
    		status===true?true:this.isActive=!this.isActive;
    	},   	
		addChildSys:function(){
			this.newName='';
    		this.newCode='';
    		this.newStatus=false;
    		this.newRemark='';
    		this.sysHandleStatus=true;
			this.sysStatus=!this.sysStatus;			
		},
		editChildSys:function(val){
			this.oldId=val.id;
			this.newName=this.oldName=val.systemName;
    		this.newCode=this.oldCode=val.systemNumber;
    		this.newStatus=this.oldStatus=val.defaultSystem;
    		this.newRemark=this.oldRemark=val.remark;
    		this.sysHandleStatus=false;
			this.sysStatus=!this.sysStatus;	
		},
		trim:function(str){
			if(isNaN(str)){
	　　     		return str.replace(/(^\s*)|(\s*$)/g, "");
			}else{
				return str
			}
　　		},
		sysNameBlur:function(oldName){
			var _this=this;
			var sysName=_this.trim(_this.newName);
			if(sysName===""){
				_this.newName="";
				return
			}
			if(oldName){ 
				//编辑状态下的失焦验证
				var data={"name":sysName,"oldName":oldName}
				axios.post("/system/hasExistForName",data)
				.then(function(res){
					if(res.data.status===1){
						_this.$message.warning("系统名已存在");
						_this.newName="";
						return
					}else{
						_this.$message.success("系统名可用");
						return
					}
				})
				.catch(function(res){
					return
				})
			}else{ 
				//添加状态下的失焦验证
				var data={"name":sysName}
				axios.post("/system/hasExistForName",data)
				.then(function(res){
					if(res.data.status===1){
						_this.$message.warning("系统名已存在");
						_this.newName="";
						return
					}else{
						_this.$message.success("系统名可用");
						return
					}
				})
				.catch(function(res){
					return
				})
			}			
		},
		sysCodeBlur:function(oldCode){
			var _this=this;
			var sysCode=_this.trim(_this.newCode);
			if(sysCode===""){
				_this.newCode="";
				return
			}
			if(oldCode){ 
				//编辑状态下的失焦验证
				var data={"code":sysCode,"oldCode":oldCode}
				axios.post("/system/hasExistForName",data)
				.then(function(res){
					if(res.data.status===1){
						_this.$message.warning("系统编号已存在");
						_this.newName="";
						return
					}else{
						_this.$message.success("系统编号可用");
						return
					}
				})
				.catch(function(res){
					return
				})
			}else{ 
				//添加状态下的失焦验证
				var data={"code":sysCode}
				axios.post("/system/hasExistForName",data)
				.then(function(res){
					if(res.data.status===1){
						_this.$message.warning("系统编号已存在");
						_this.newName="";
						return
					}else{
						_this.$message.success("系统编号可用");
						return
					}
				})
				.catch(function(res){
					return
				})
			}			
		},
		saveNewSys:function(){
			var _this=this;
			var sysName=_this.trim(_this.newName);
			if(sysName===""){
				_this.$message.warning("请输入系统名");
				_this.newName="";
				return
			}
			var sysCode=_this.trim(_this.newCode);
			if(sysCode===""){
				_this.$message.warning("请输入系统编码");
				_this.newCode="";
				return
			}
			var sysRemark=_this.trim(_this.newRemark);
			_this.fullscreenLoading=true;
			var data={"sysName":sysName,"sysCode":sysCode,"sysStatus":_this.newStatus,"remark":sysRemark}
			axios.post("/system/insert",data)
			.then(function(res){
				if(res.data.status===0){
					_this.$message.success("添加成功");
					axios.post("/system/queryAllSystem",{})
			    	.then(function(res){
			    		if(res.data.status===0){
				    		_this.tableData=res.data.data;
				    		_this.fullscreenLoading=false;
				    		_this.sysStatus=true;
				    		return
			    		}else{
			    			_this.fullscreenLoading=false;
			    			_this.sysStatus=true;
			    			_this.$message.error("系统列表加载失败请刷新页面");
			    			return
			    		}
			    	})
			    	.catch(function(res){
			    		_this.fullscreenLoading=false;
			    		_this.sysStatus=true;
			    		_this.$message.error("系统列表加载失败请刷新页面");
			    		return			    	
			    	})
				}else{
					_this.fullscreenLoading=false;
					_this.$message.error("添加失败");	
					return
				}
			})
			.catch(function(res){
				_this.fullscreenLoading=false;
				_this.$message.error("添加失败");	
				return
			})
		},
		saveEditSys:function(id){
			var _this=this;
			var sysName=_this.trim(_this.newName);
			if(sysName===""){
				_this.$message.warning("请输入系统名");
				_this.newName="";
				return
			}
			var sysCode=_this.trim(_this.newCode);
			if(sysCode===""){
				_this.$message.warning("请输入系统编码");
				_this.newCode="";
				return
			}
			var sysRemark=_this.trim(_this.newRemark);
			if(sysName===_this.oldName&&sysCode==_this.oldCode&&sysRemark===_this.oldRemark&&_this.oldStatus==_this.newStatus){
				_this.$message.warning("信息未修改");
				_this.sysStatus=true;
				return
			}
			_this.fullscreenLoading=true;
			var data={"sysId":_this.oldId,"sysName":sysName,"sysCode":sysCode,"remark":sysRemark}
			axios.post("/system/insert",data)
			.then(function(res){
				if(res.data.status===0){
					_this.$message.success("修改成功");
					axios.post("/system/queryAllSystem",{})
			    	.then(function(res){
			    		if(res.data.status===0){
				    		_this.tableData=res.data.data;
				    		_this.fullscreenLoading=false;
				    		_this.sysStatus=true;
				    		return
			    		}else{
			    			_this.fullscreenLoading=false;
			    			_this.sysStatus=true;
			    			_this.$message.error("系统列表加载失败请刷新页面");
			    			return
			    		}
			    	})
			    	.catch(function(res){
			    		_this.fullscreenLoading=false;
			    		_this.sysStatus=true;
			    		_this.$message.error("系统列表加载失败请刷新页面");
			    		return			    	
			    	})
				}else{
					_this.fullscreenLoading=false;
					_this.$message.error("修改失败");	
					return
				}
			})
			.catch(function(res){
				_this.fullscreenLoading=false;
				_this.$message.error("修改失败");	
				return
			})
		},
		//权限申请列表
		loadApplyList:function(status){
    		var _this=this;
    		if(status===true){
    			return
    		}else{ 	
    			_this.isActive=!_this.isActive;
    			_this.screenLoading=true;
    			axios.get("data5.json")
    			.then(function(res){
    				if(res.data.status===0){
    					_this.applyData=res.data.data.dataList; 
    					_this.screenLoading=false;
    					return
    				}else{
    					_this.screenLoading=false;    					
    					_this.$message.error("请求失败")
    					return
    				}
    			})
    			.catch(function(res){
    				_this.screenLoading=false;
    				_this.$message.error("请求失败")
    				return
    			})
    		}
    	},
    	checkApply:function(val){
    		var _this=this;
    		_this.screenLoading=true;
    		_this.applyDetailInfo=val;
    		var applyNum=_this.applyNumber=val.applyNumber;
    		var data=new URLSearchParams()
    		data.append("applyNum",applyNum)
    		axios.post("/audit/querySubUserInfo",data)
    		.then(function(res){
    			if(res.data.status===0){
    				_this.childSysInfo=res.data.data;
    				_this.requsetStatus=false;
    				_this.screenLoading=false;
    				return
    			}else{
    				_this.screenLoading=false;
    				_this.$message.error("查看详情失败");
    				return
    			}
    		})
    		.catch(function(res){
    			_this.screenLoading=false;
				_this.$message.error("查看详情失败");
				return
    		})
    	},
    	auditApply:function(num){
    		this.auditNum=1;
    		this.auditText="";
    		this.dialogFormVisible = true;
    		this.applyNumber=num;
    	},
    	confirmApply:function(num,status,remark){
    		var _this=this;
    		status==2?status=false:status=true;
    		var data={"applyOrderNumber":num,"isPass":status,"cause":remark}
    		if(status===false){
    			if(_this.trim(remark)===""){
    				_this.$message.warning("请输入驳回说明")
    				return
    			}else{
    				_this.dialogFormVisible=false;
    				_this.screenLoading=true;
    				axios.post("/audit/auditApply",data)
	    			.then(function(res){
	    				if(res.data.status===0){
	    					_this.$message.success("驳回成功");
	    					axios.get("/audit/applyList")
			    			.then(function(res){
			    				if(res.data.status===0){
			    					_this.applyData=res.data.data.dataList;
			    					_this.screenLoading=false;
			    					return
			    				}else{
			    					_this.screenLoading=false;
			    					_this.$message.error("审核列表刷新失败");
			    					return
			    				}
			    			})
			    			.catch(function(res){
			    				_this.screenLoading=false;
			    				_this.$message.error("审核列表刷新失败");
			    				return
			    			})
	    				}else{
	    					_this.screenLoading=false;
	    					_this.$message.error("操作失败");   					
	    					return
	    				}
	    			})
	    			.catch(function(res){
	    				_this.screenLoading=false;
	    				_this.$message.error("操作失败"); 
	    				return    				
	    			})
    			}
    		}else{
    			_this.dialogFormVisible=false;
    			_this.screenLoading=true;
    			axios.post("/audit/auditApply",data)
    			.then(function(res){
    				if(res.data.status===0){
    					_this.$message.success("审核通过");
    					axios.get("/audit/applyList")
		    			.then(function(res){
		    				if(res.data.status===0){
		    					_this.applyData=res.data.data.dataList;
		    					_this.screenLoading=false;
			    				return
		    				}else{
		    					_this.screenLoading=false;
		    					_this.$message.error("审核列表刷新失败");	    					
			    				return
		    				}
		    			})
		    			.catch(function(res){
		    				_this.screenLoading=false;
		    				_this.$message.error("审核列表刷新失败");
			    			return
		    			})
    				}else{
    					_this.screenLoading=false;
    					_this.$message.error("操作失败");
			    		return
    				}
    			})
    			.catch(function(res){
    				_this.screenLoading=false;
    				_this.$message.error("操作失败");
			    	return
    			})
    		}
    	},
    	changeAuditRadio:function(val){
    		this.auditNum=val
    	},
    	changeAuditRemark:function(val){
    		this.auditText=val
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
    	auditLimit:function(e){
    		if(e===true){
    			return "申请成功"
    		}else if(e===false){
    			return "申请失败"
    		}else{
    			return "申请中"
    		}
    	}
    },
    components:{
    	"audit-radio":{
    		template:'<el-radio-group v-model="num"><el-radio :label="1">通过</el-radio><el-radio :label="2">驳回</el-radio></el-radio-group>',	   		
			props:['num'],
	   		methods:{
	   			auditNum:function(){	   				
	   				this.$emit('radio-monitor',this.num)
	   			}
	   		},	   		
	   		mounted:function(){
	   			this.auditNum()
	   		},
	   		watch:{
	   			num:function(){
	   				this.auditNum()
	   			}
	   		}
	   	},
	   	"audit-remark":{
	   		template:'<div style="text-align:center;margin-top:20px;"><textarea v-model="text" placeholder="请输入备注" style="width:400px;height:80px;line-height:26px;resize:none;font-size:14px;border-radius:4px"></textarea></div>',
			props:['text'],
	   		methods:{
	   			auditRemark:function(){	   				
	   				this.$emit('remark-monitor',this.text)
	   			}
	   		},
	   		mounted:function(){
	   			this.auditRemark()
	   		},
	   		watch:{
	   			text:function(){
	   				this.auditRemark()
	   			}
	   		}
    	}
    }
})
