# API
1. 基础数据
    1. [dept 部门](#dept)
    2. [user 用户](#user)


##  <span id='dept'>dept</span>
> 1. 获取部门树 **/dept/tree**

deptcode 可忽略
```
req:{
    deptcode:1
}
res:[
    {guid:1,deptcode:'01',deptname:'测试部门01',remark:'beizhu01',pid:0},
    {guid:2,deptcode:'02',deptname:'测试部门02',remark:'beizhu02',pid:1},
    {guid:3,deptcode:'03',deptname:'测试部门03',remark:'beizhu03',pid:2},
    {guid:4,deptcode:'04',deptname:'测试部门04',remark:'beizhu04',pid:0}
]
```
> 2. 部门修改 **/dept/tree**
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
> 1. 分页查询    **/user/page**

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
> 2. 保存/修改 **/user/saveUpdate**

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

