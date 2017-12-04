# API
1. 用户模块
    1. [dept 部门](#dept)
    2. [user 用户](#user)
    3. [post 岗位](#post)
    4. [menu 菜单](#menu)
    5. [role 角色](#role)
    6. [login 登录](#login)

2. 基础数据
    1. [region 行政区划](#region)
    2. [rate 利率](#rate)
    
3. 核心业务
    1. [apply 贷款申请](#apply)
4. 通用方法
    1. [download 下载](#download)
##  <span id='dept'>dept</span>
获取部门树 **/dept/tree**

```
req:{
    deptcode:1
}
res:[
    {guid: 1, deptcode: '01', deptname: '测试部门01', remark: 'beizhu01', pid: 0, _id: 'dept_1', _pid: 'dept_0', _title: '测试部门01'},
    {guid: 2, deptcode: '02', deptname: '测试部门02', remark: 'beizhu02', pid: 1, _id: 'dept_2', _pid: 'dept_1', _title: '测试部门02'},
    {guid: 3, deptcode: '03', deptname: '测试部门03', remark: 'beizhu03', pid: 2, _id: 'dept_3', _pid: 'dept_2', _title: '测试部门03'},
    {guid: 4, deptcode: '04', deptname: '测试部门04', remark: 'beizhu04', pid: 0, _id: 'dept_4', _pid: 'dept_0', _title: '测试部门04'}
]
```
部门修改 **/dept/tree**
```
req:{
    guid:1,
    deptcode:'01'
    ……
}
res:{
    success:true,
    message:'保存成功'
}
```
## <span id='user'>user</span>
分页查询    **/user/page**

```
req:{
    pageSize:20,
    current:1,
    order:'nickname',
    orderby:'desc'
    ……额外的查询属性
}
res:{
    page:{
        pageSize:20,
        current:1,
        total:200
    },
    data:[
        {guid:1,nickname:'测试用户01',account:'测试帐号01',deptid:1,deptname:'部门01',postid:2,postname:'测试岗位',addtime:'2017-10-10 21:00:01',status:'0',remark:'备注'},
        {guid:2,nickname:'测试用户02',account:'测试帐号02',deptid:1,deptname:'部门01',postid:2,postname:'测试岗位',addtime:'2017-10-10 21:00:01',status:'1',remark:'备注备注'},
        {guid:3,nickname:'测试用户03',account:'测试帐号03',deptid:1,deptname:'部门01',postid:2,postname:'测试岗位',addtime:'2017-10-10 21:00:01',status:'2',remark:'备注备注备注'}
    ]}
```
保存/修改 **/user/saveUpdate**

有主键save 无主键update
```
req:{
    guid:1,
    nickname:'测试用户01',
    account:'测试帐号01',
    ……
}

res:{
    success:true,
    message:'保存成功'
}
```
删除用户 **/user/remove**
```
req:{
    guid:1
}
res:{
    success:true,
    message:''
}
```
##  <span id='post'>post</span>

获取部门+岗位树  **/post/tree**
```
req:{
    deptid:1
}
res:[
    {guid: 1, deptcode: '01', deptname: '测试部门01', remark: 'beizhu01', pid: 0, _id: 'dept_1', _pid: '0', _title: '测试部门01'},
    {guid: 2, deptcode: '02', deptname: '测试部门02', remark: 'beizhu02', pid: 1, _id: 'dept_2', _pid: '1', _title: '测试部门02'},
    {guid: 3, deptcode: '03', deptname: '测试部门03', remark: 'beizhu03', pid: 2, _id: 'dept_3', _pid: '2', _title: '测试部门03'},
    {guid: 4, deptcode: '04', deptname: '测试部门04', remark: 'beizhu04', pid: 0, _id: 'dept_4', _pid: '0', _title: '测试部门04'},
    {guid: 1, postname: '岗位01', remark: '', fDeptid: 3, enable: 0, _id: 'post_1', _pid: '3', _title: '岗位01'},
    {guid: 2, postname: '岗位02', remark: '', fDeptid: 3, enable: 0, _id: 'post_2', _pid: '3', _title: '岗位02'}
]

```
岗位维护页面所需的数据 **/post/pageData**
```
res:{
    tree:[
        {guid: 1, deptcode: '01', deptname: '测试部门01', remark: 'beizhu01', pid: 0, _id: 'dept_1', _pid: 'dept_0', _title: '测试部门01'},
        {guid: 2, deptcode: '02', deptname: '测试部门02', remark: 'beizhu02', pid: 1, _id: 'dept_2', _pid: 'dept_1', _title: '测试部门02'},
        {guid: 3, deptcode: '03', deptname: '测试部门03', remark: 'beizhu03', pid: 2, _id: 'dept_3', _pid: 'dept_2', _title: '测试部门03'},
        {guid: 4, deptcode: '04', deptname: '测试部门04', remark: 'beizhu04', pid: 0, _id: 'dept_4', _pid: 'dept_0', _title: '测试部门04'},
        {guid: 1, postname: '岗位01', remark: '', fDeptid: 3, enable: 0, _id: 'post_1', _pid: 'dept_3', _title: '岗位01'},
        {guid: 2, postname: '岗位02', remark: '', fDeptid: 3, enable: 0, _id: 'post_2', _pid: 'dept_3', _title: '岗位02'}
    ],
    roles:[
        {guid: 1, rolename: '角色01',  remark: 'beizhu01', enable: 0},
        {guid: 2, rolename: '角色02',  remark: 'beizhu02', enable: 1},
        {guid: 3, rolename: '角色03',  remark: 'beizhu03', enable: 1},
        {guid: 4, rolename: '角色04',  remark: 'beizhu04', enable: 0}
    ]
}
```

新增修改岗位  **/post/saveUpdate**
```
req:{
    guid:1
    fDeptid:1
    ……
}
res:{
    success:true,
    message:'保存成功'
}
```

删除岗位  **/post/remove**
```
req:{
    guid:1
}
res:{
    success:true,
    message:''
}
```

岗位角色关联 **/postRole/saveUpdate**
```
req:{
    postId:1
    roleIds:'1,2,3'
}
res:{
    success:true,
    message:''
}
```


## <span id="menu">menu</span>

查询菜单 **/menu/tree**
```
req:{
 
}
res:[
    {guid: 1, menuname: '我的主页', menuurl: '/index', pGuid: '0',enbale:1,  _id: 'menu_1', _pid: 'menu_0', _title: '我的主页'},
    {guid: 2, menuname: '基础数据管理', menuurl: '', pGuid: '0',enbale:1,  _id: 'menu_2', _pid: 'menu_0', _title: '基础数据管理'},
    {guid: 3, menuname: '行政区划管理', menuurl: '/region', pGuid: '2',enbale:1,  _id: 'menu_3', _pid: 'menu_2', _title: '行政区划管理'},
    {guid: 4, menuname: '金融机构', menuurl: '', pGuid: '2',enbale:1,  _id: 'menu_4', _pid: 'menu_2', _title: '金融机构'},
    {guid: 5, menuname: '贷款机构', menuurl: '', pGuid: '2',enbale:1,  _id: 'menu_5', _pid: 'menu_2', _title: '贷款机构'},
    {guid: 6, menuname: '贷款类型', menuurl: '', pGuid: '2',enbale:1,  _id: 'menu_6', _pid: 'menu_2', _title: '贷款类型'},
    {guid: 7, menuname: '权限管理', menuurl: '', pGuid: '0',enbale:1,  _id: 'menu_7', _pid: 'menu_0', _title: '权限管理'},
    {guid: 8, menuname: '部门管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_8', _pid: 'menu_7', _title: '部门管理'},
    {guid: 9, menuname: '岗位管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_9', _pid: 'menu_7', _title: '岗位管理'},
    {guid: 10, menuname: '角色管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_10', _pid: 'menu_7', _title: '角色管理'},
    {guid: 11, menuname: '菜单管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_11', _pid: 'menu_7', _title: '菜单管理'},
    {guid: 12, menuname: '用户管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_12', _pid: 'menu_7', _title: '用户管理'},
]
```

修改菜单 **/menu/update**
```
req:{
    guid:1,
    menuname:'',
    ……
}
res:{
    success:true,
    message:''
}
```



根据roleId 获取 关联menuIds **/menu/getMenuIds**
```
req:{
    roleId:1
}

res:[1,2,3]
```

## <span id='role'>role</span>
角色查询 **role/list**
```
req:{
    enable:0
}
res:[
    {guid: 1, rolename: '角色01',  remark: 'beizhu01', enable: 0},
    {guid: 2, rolename: '角色02',  remark: 'beizhu02', enable: 1},
    {guid: 3, rolename: '角色03',  remark: 'beizhu03', enable: 1},
    {guid: 4, rolename: '角色04',  remark: 'beizhu04', enable: 0}
]
```
获取角色管理页所需的数据 **/role/pageData**
```
res{
    roles:[
        {guid: 1, rolename: '角色01',  remark: 'beizhu01', enable: 0},
        {guid: 2, rolename: '角色02',  remark: 'beizhu02', enable: 1},
        {guid: 3, rolename: '角色03',  remark: 'beizhu03', enable: 1},
        {guid: 4, rolename: '角色04',  remark: 'beizhu04', enable: 0}
    ],
    menuTree:[
        {guid: 1, menuname: '我的主页', menuurl: '/index', pGuid: '0',enbale:1,  _id: 'menu_1', _pid: 'menu_0', _title: '我的主页'},
        {guid: 2, menuname: '基础数据管理', menuurl: '', pGuid: '0',enbale:1,  _id: 'menu_2', _pid: 'menu_0', _title: '基础数据管理'},
        {guid: 3, menuname: '行政区划管理', menuurl: '/region', pGuid: '2',enbale:1,  _id: 'menu_3', _pid: 'menu_2', _title: '行政区划管理'},
        {guid: 4, menuname: '金融机构', menuurl: '', pGuid: '2',enbale:1,  _id: 'menu_4', _pid: 'menu_2', _title: '金融机构'},
        {guid: 5, menuname: '贷款机构', menuurl: '', pGuid: '2',enbale:1,  _id: 'menu_5', _pid: 'menu_2', _title: '贷款机构'},
        {guid: 6, menuname: '贷款类型', menuurl: '', pGuid: '2',enbale:1,  _id: 'menu_6', _pid: 'menu_2', _title: '贷款类型'},
        {guid: 7, menuname: '权限管理', menuurl: '', pGuid: '0',enbale:1,  _id: 'menu_7', _pid: 'menu_0', _title: '权限管理'},
        {guid: 8, menuname: '部门管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_8', _pid: 'menu_7', _title: '部门管理'},
        {guid: 9, menuname: '岗位管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_9', _pid: 'menu_7', _title: '岗位管理'},
        {guid: 10, menuname: '角色管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_10', _pid: 'menu_7', _title: '角色管理'},
        {guid: 11, menuname: '菜单管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_11', _pid: 'menu_7', _title: '菜单管理'},
        {guid: 12, menuname: '用户管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_12', _pid: 'menu_7', _title: '用户管理'},
    ]
}
```

根据postID 获取关联的roleIds **/post/getRoleIds**
```
req:{
    postId:1
}
res:[ 1,2,3 ]


```

角色新增/修改 **/role/saveUpdate**
```
req:{
    guid:1,
    rolename:''
    ……
}
res:{
    success:true,
    message:''
}
```
 
 角色删除 **/role/remove**
 ```
 res:{
    guid:1
 }
 res:{
     success:true,
     message:''
 }
 ```
 
 角色菜单关联 **/roleMenu/saveUpdate**
 
 ```
 req:{
     roleId:1
     menuIds:'1,2,3'
 }
 res:{
     success:true,
     message:''
 }
 ```
 
 ## <span id="login">login</span>
 
 登录 **/login**
 
```
req:{
    account:'',
    password:''
}

res:{
    token:'',
    menus:[
        {guid: 1, menuname: '我的主页', menuurl: '/index', pGuid: '0',enbale:1,  _id: 'menu_1', _pid: 'menu_0', _title: '我的主页'},
        {guid: 2, menuname: '基础数据管理', menuurl: '', pGuid: '0',enbale:1,  _id: 'menu_2', _pid: 'menu_0', _title: '基础数据管理'},
        {guid: 3, menuname: '行政区划管理', menuurl: '/region', pGuid: '2',enbale:1,  _id: 'menu_3', _pid: 'menu_2', _title: '行政区划管理'},
        {guid: 4, menuname: '金融机构', menuurl: '', pGuid: '2',enbale:1,  _id: 'menu_4', _pid: 'menu_2', _title: '金融机构'},
        {guid: 5, menuname: '贷款机构', menuurl: '', pGuid: '2',enbale:1,  _id: 'menu_5', _pid: 'menu_2', _title: '贷款机构'},
        {guid: 6, menuname: '贷款类型', menuurl: '', pGuid: '2',enbale:1,  _id: 'menu_6', _pid: 'menu_2', _title: '贷款类型'},
        {guid: 7, menuname: '权限管理', menuurl: '', pGuid: '0',enbale:1,  _id: 'menu_7', _pid: 'menu_0', _title: '权限管理'},
        {guid: 8, menuname: '部门管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_8', _pid: 'menu_7', _title: '部门管理'},
        {guid: 9, menuname: '岗位管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_9', _pid: 'menu_7', _title: '岗位管理'},
        {guid: 10, menuname: '角色管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_10', _pid: 'menu_7', _title: '角色管理'},
        {guid: 11, menuname: '菜单管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_11', _pid: 'menu_7', _title: '菜单管理'},
        {guid: 12, menuname: '用户管理', menuurl: '/index', pGuid: '7',enbale:1,  _id: 'menu_12', _pid: 'menu_7', _title: '用户管理'},
    ],
    user:{
        guid:1,
        nickname:'测试用户01',
        account:'测试帐号01',
        deptid:1,
        deptname:'部门01'
    }
}
```

登出 **/logout**
```
req:{
    account
}
res:{
    success:true,
    message:''
}
```
 
 
## <span id="region">region</span>
新增新增区划 **/region/saveUpdate**

## <span id="rate">rate</span>
提供利率option **/loanapply/getRatesSelection**
```
req:{
    loanTypeId:
    repayMethodCode:
    loanTermId：
}
res:[{
    rates:
    rateName:
    }
]
```
## <span id="apply">apply</span>

获取贷款申请数据 **/loanapply/page**
```
req:{
    pageSize:20,
    current:1,
    order:'nickname',
    orderby:'desc'
    step:'',
    ……额外的查询属性
}
res:{
    page:{
        pageSize:20,
        current:1,
        total:200
    },
    data:[{
        guid: 1,
        applyno: '0100',
        applytel: '13988888888',
        applyname: '测试用户',
        applyidcard: '33010219990101001X',
        loanttypename: '非上市银行股权质押贷款',
        repaymethodname: '本息同额',
        loanterm: 24,
        applystatus: 0,
        applydate: '2017-12-01',
        applymoney: '1000000',
        applytime: '2017-11-28 12:03:46',
        detail: [{
            bankinfoName: '测试银行',
            amount: 50000,
            stocktype: 3,
            hascertificate: 1,
            ensplit: 0,
            certificatePic1: {
                fileNo:''
                fileType:''
                fileName:''
                fileRealName:'./test.jpg'
            },
            certificatePic2: {
                fileNo:''
                fileType:''
                fileName:''
                fileRealName:'./test.jpg'
            }
        }]
    },{
        guid: 2,
        applyno: '0101',
        applytel: '13988888888',
        applyname: '测试用户1',
        applyidcard: '33010219990101001X',
        loanttypename: '非上市银行股权质押贷款',
        repaymethodname: '本息同额',
        loanterm: 36,
        applystatus: 0,
        applydate: '2017-12-01',
        applymoney: '8000',
        applytime: '2017-11-28 12:03:46',
        detail: [{
            bankinfoName: '测试银行',
            amount: 50000,
            stocktype: 3,
            hascertificate: 1,
            ensplit: 0,
            certificatePic1: {
                fileNo:''
                fileType:''
                fileName:''
                fileRealName:'./test.jpg'
            },
            certificatePic2: {
                fileNo:''
                fileType:''
                fileName:''
                fileRealName:'./test.jpg'
            }
        }]
    }
]}
```

根据流程阶段获取文件列表 **loanapply/getFilesByStep**
```
req:{
    guid:1,
    step:'auditing'
}
res:[{
    fileNo:''
    fileType:''
    fileName:'',
    ……
},{
    fileNo:''
    fileType:''
    fileName:'',
    ……
}]
```
根据流程阶段 详细信息以及文件 **loanapply/getStepDetail**
```
req:{
    guid:1,
    step:'auditing'
}

res:{
    files:[{
       fileNo:''
       fileType:''
       fileName:'',
       ……
   },{
       fileNo:''
       fileType:''
       fileName:'',
       ……
   }],
    stepDetail:{
        
    }
}
```

上传流程附件 **loanapply/upload**
```
req:{
    guid:1,
    step:'auditing',
    file
}

res:{
    success:true,
    message:''
    fileNo''
}
```


删除流程中的文件附件 **loanapply/removeFile**
```
req:{
     guid:1,
     step:'auditing',
     fileNo:''
}

res:{
    success:true,
}
```

流程提交 **/loanapply/step**
```
req:{
    guid:1,
    status:'', （0已申请，10初审成功，11初审失败，20用户确认，21用户确认失败，30签约成功，31签约失败，40完成质押，41质押失败，99放款成功）
    remark:'''
}
res:{
    success:true,
    message:''
}
```
## <span id="download">download</span>
下载文件 **/download**
```
req:{
     fileNo:''
}

res:{
    
}
```




行政区划分页查询 **/region/page**

 ```
 req:{
    pageSize:2,
    current:1
 }
res:{
    page:{
        pageSize:2,
        current:2,
        total :100
     },
     data:[{
            reginame: '河北省',
            regicode: 130000,
            sort:1,
            p_Regicode:0,
            children: [{
                        reginame: '长安区',
                        regicode: 130002,
                        p_Regicode: 130000,
                        sort:2
                    }, {
                        reginame: '桥西区',
                        regicode: 130004,
                        p_Regicode: 130000,
                        sort:0
                    }]
        }, {
            reginame: '天津市',
            regicode: 120000,
            sort:0,
            p_Regicode:0,
            children:[{
                reginame: '和平区',
                regicode: 120001,
                p_Regicode: 120000,
                sort:1
            }]
        }]
    }

 ```
 行政区划查询 **/region/list**
 ```
 res:{
    data:[{
            reginame: '河北省',
            regicode: 130000,
            sort:1,
            p_Regicode:0,
            children: [{
                        reginame: '长安区',
                        regicode: 130002,
                        p_Regicode: 130000,
                        sort:2
                    }, {
                        reginame: '桥西区',
                        regicode: 130004,
                        p_Regicode: 130000,
                        sort:0
                    }]
            }, {
                reginame: '天津市',
                regicode: 120000,
                sort:0,
                p_Regicode:0,
                children:[{
                    reginame: '和平区',
                    regicode: 120001,
                    p_Regicode: 120000,
                    sort:1
                }]
          }]
 }

 ```
 行政区划新增和修改 **/region/saveUpdate**

 ```
 req:{
    p_Regicode: 120000
    regicode: 120001
    reginame: 和平区
    sort: 0
 }
 res:{
    success:true,
    message:'保存成功'
 }

 ```
 行政区划删除 **/region/remove**
 ```
 req:{
    regicode:12000
 }
 res:{
    success:true,
    message:''
 }

 ```
 贷款类型分页请求 **/loantype/page**

 ```
 req:{
    pageSize:2,
    current:1
 }
 res:{
    page:{
        pageSize:2,
        current:2,
        total :50
     },
    data:[{
         guid:1,
         loanTypeName: '非上市银行股权质押贷款',
         remark: '非上市银行股权质押贷款',
         status: 0,
         sort:1
     },{
        guid:2,
        loanTypeName: '房地产抵押贷款',
         remark: '房地产抵押贷款',
         status: 1,
         sort: 0
     },{
        guid:3,
        loanTypeName: '地产抵押贷款',
        remark: '地产抵押贷款',
        status: 2,
        sort: 2
    }]
 }

 ```
 贷款类型请求 **/loantype/list**

 ```
 res:{
    data:[{
             guid:1,
             loanTypeName: '非上市银行股权质押贷款',
             remark: '非上市银行股权质押贷款',
             status: 0,
             sort:1
         },{
         guid:2,
            loanTypeName: '房地产抵押贷款',
             remark: '房地产抵押贷款',
             status: 1,
             sort: 0
         }]
 }

 ```
 贷款类型新增和修改 **/loantype/saveUpdate**
 有guid为修改 没有guid为新增
 ```
 req:{
    guid: 1,
    loanTypeName: '非上市银行股权质押贷款',
    remark: '非上市银行股权质押贷款说明',
    status: 0,
    sort: 0
 }
 res:{
    success:true,
    message:''
 }

 ```
 贷款类型删除 **/loantype/remove**
 ```
 req:{
    guid:1
 }
 res:{
    success:true,
    message:''
 }

 ```
 贷款期限及利率分页查询 **/loanrate/page**
 ```
 req:{
    pageSize:20,
    current：1
 }
 res:{
    page:{
        pageSize:2,
        current:2,
        total :100
     },
     data:[{
              guid:1,
              fLoanTypeId: `1`,
              loanTypeName: '非上市银行股权质押贷款',
              fRepayMethodCode:`1`,
              repayMethod: '先息后本',
              fLoanTermId:`1`,
              loanTerm: '12期',
              rates: 0.01,
              rateName:'普通会员'
          },{
              guid:2,
              fLoanTypeId: `2`,
              loanTypeName: '房地产抵押贷款',
              fRepayMethodCode:`2`,
              repayMethod: '本息同额',
              fLoanTermId:`2`,
              loanTerm: '24期',
              rates: 0.022,
              rateName:'高级会员'
          }]
  }

  ```
  贷款期限及利率新增和修改 **/loanrate/saveUpdate**
   有主键为修改  没有主键为新增
  ```
  req:{
    guid: 1,
    rateName: '普通会员',
    fLoanTypeId: 1,
    fRepayMethodCode: 1,
    fLoanTermId: 1,
    rates: 0.001
  }
  res:{
      success:true,
      message:''
  }

  ```
  贷款期限及利率删除  **/loanrate/remove**

  ```
  req:{
    guid: 1
  }
  res:{
        success:true,
        message:''
   }

 ```
 还款方式分页查询 **/repaymethod/page**

 ```
 req:{
    pageSize:20,
    current：1
 }
 res:{
    page:{
        pageSize:2,
        current:2,
        total :100
     },
     data : [{
         methodCode:1,
         methodName: '先息后本',
         remark: '先息后本',
     },{
         methodCode:2,
         methodName: '本息同额',
         remark: '本息同额',
     }]
 }

 ```
 还款方式请求 **/repaymethod/list**
 ```
 res:{
    data:[{
             methodCode:1,
             methodName: '先息后本',
             remark: '先息后本',
         },{
             methodCode:2,
             methodName: '本息同额',
             remark: '本息同额',
        }]
 }

 ```
 还款方式新增和修改 **/repaymethod/saveUpdate**
 有methodCode为修改  没有methodCode为新增
 ```
 req:{
    methodCode: 1
    methodName: '先息后本',
    remark: '先息后本'
 }
 res:{
    success:true,
    message:''
 }

 ```
 还款方式删除 **/repaymethod/remove**

 ```
 req:{
    regicode:1
 }
 res:{
     success:true,
     message:''
  }

  ```
  贷款期限请求  **/loanterm/list**
  ```
  res:{
    data:[{
            guid:1,
            loanTermName:'12期',
            stauts:0
        },{
            guid:2,
            loanTermName:'24期',
            stauts:0
        },{
            guid:3,
            loanTermName:'36期',
            stauts:0
        }]
  }

  ```


