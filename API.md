# API
1. 基础数据
    1. [dept 部门](#dept)
    2. [user 用户](#user)
    3. [post 岗位](#post)


##  <span id='dept'>dept</span>
获取部门树 **/dept/tree**

```
req:{
    deptcode:1
}
res:[
    {guid:1,deptcode:'01',deptname:'测试部门01',remark:'beizhu01',pid:0 ,_id:'1',_pid:'0'},
    {guid:2,deptcode:'02',deptname:'测试部门02',remark:'beizhu02',pid:1 ,_id:'2',_pid:'1'},
    {guid:3,deptcode:'03',deptname:'测试部门03',remark:'beizhu03',pid:2,_id:'3',_pid:'2'},
    {guid:4,deptcode:'04',deptname:'测试部门04',remark:'beizhu04',pid:0,_id:'4',_pid:'0'}
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
