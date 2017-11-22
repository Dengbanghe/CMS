/**
 * Created by AndrewH on 2017/11/22.
 */

const transfer2tree = (data, {parentId, idField, pidField,sort}={}) => {
    const itemArr = []

    idField = idField == undefined ? '_id' : idField
    pidField = pidField == undefined ? '_pid' : pidField
    parentId = parentId == undefined ? '0' :parentId
    if(sort){
       data = data.sort(sort)
    }
    for (let item of data) {
        if (item[pidField] == parentId) {
            itemArr.push({...item, children: transfer2tree(data, {parentId:item[idField], idField:idField, pidField:pidField})})
        }
    }
    return itemArr;
}
module.exports = {transfer2tree}
var data1 = [{guid: "1", deptcode: '01', deptname: '测试部门01', remark: 'beizhu01', pid: 0, _id: 1, _pid: 0, _title: '测试部门01'},
    {guid: "2", deptcode: '02', deptname: '测试部门02', remark: 'beizhu02', pid: 1, _id: 2, _pid: 1, _title: '测试部门02'},
    {guid: "3", deptcode: '03', deptname: '测试部门03', remark: 'beizhu03', pid: 2, _id: 3, _pid: 2, _title: '测试部门03'},
    {guid: "4", deptcode: '04', deptname: '测试部门04', remark: 'beizhu04', pid: 1, _id: 4, _pid: 1, _title: '测试部门04'}]
    var data = [
        {guid: 1, deptcode: '01', deptname: '测试部门01', remark: 'beizhu01', pid: 0, _id: '1', _pid: '0', _title: '测试部门01'},
        {guid: 2, deptcode: '02', deptname: '测试部门02', remark: 'beizhu02', pid: 1, _id: '2', _pid: '1', _title: '测试部门02'},
        {guid: 3, deptcode: '03', deptname: '测试部门03', remark: 'beizhu03', pid: 2, _id: '3', _pid: '2', _title: '测试部门03'},
        {guid: 4, deptcode: '04', deptname: '测试部门04', remark: 'beizhu04', pid: 0, _id: '4', _pid: '0', _title: '测试部门04'},
        {guid: 1, postname: '岗位01', remark: '', fDeptid: 3, enable: 0, _id: 'post_1', _pid: '3', _title: '岗位01'},
        {guid: 2, postname: '岗位02', remark: '', fDeptid: 3, enable: 0, _id: 'post_1', _pid: '3', _title: '岗位02'},
    ];
const tree = transfer2tree(data1)
console.log(JSON.stringify(tree))