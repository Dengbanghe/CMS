# API
1. 基础数据
    1. [dept 部门](#dept)
    2. [user 用户](#user)
    3. [post 岗位](#post)
    4. [menu 菜单](#menu)
    5. [role 角色](#role)


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
 
 
 

