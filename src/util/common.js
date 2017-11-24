import isofetch from 'isomorphic-fetch'
import React from 'react'
import { message ,Tree} from 'antd';
const TreeNode = Tree.TreeNode
/**
 *  通用请求方法 //todo 需补完token验证
 *  若返回 {success:{Boolean},message:{String}}格式数据 会自动调用 message.success or error
 *  确保使用 async await
 * @param url
 *      请求地址 {String}
 * @param data
 *      请求参数 将被转换为formData {Object}
 * @param method
 *      请求方法 {String} default:'post'
 * @returns {Promise.<{}>}
 */
const fetch=async(url,data,method='post')=>{
    let formData = new FormData();
    for(let key in data){
        if(data[key]==undefined)continue
        formData.append(key,data[key])
    }
    let res,result={}
    try {
        res = await isofetch(url, {method: method, body: formData})
        if (res.status === 200) {
            result = await res.json();
            if(result.success){
                message.success(result.message)
            }
        }else if(res.status === 404){
            message.error(`请求的资源 ${url} 不存在 请联系管理员`)
        }else if(res.status === 500){
            message.error(result.message)
        }
    }catch(e){
        message.error(e)
        console.error(e)
    }finally {
        return result
    }
}
/**
 *
 * 用于从简单list格式数据 转换为tree结构
 * @param array
 *      原数据 {Array}
 * @param rootId
 *      根节点id {String}default:'0'
 * @param idField
 *      id字段名 {String}default:'_id'
 * @param pidField
 *      父id字段名 {String}default:'_pid'
 * @param sort
 *      排序方法 {Function} 同 Array.sort的参数
 * @returns {Array}
 */
const transfer2tree = (data, {rootId, idField, pidField,sort}={}) => {
    const itemArr = []

    idField = idField == undefined ? '_id' : idField
    pidField = pidField == undefined ? '_pid' : pidField
    rootId = rootId == undefined ? '0' :rootId
    if(sort){
        data = data.sort(sort)
    }
    for (let item of data) {
        if (item[pidField] == rootId) {
            let children = transfer2tree(data, {rootId:item[idField], idField:idField, pidField:pidField})
            if(children.length>0){
                itemArr.push({...item, children: children})
            }else {
                itemArr.push(item)
            }
        }
    }
    return itemArr;
}
const treeLooper = data => {
    return data.map((item) => {
        if (item.children) {
            return (
                <TreeNode key={item._id} title={item._title} dataRef={item}>
                    {treeLooper(item.children)}
                </TreeNode>
            )
        }
        return <TreeNode key={item._id} title={item._title} dataRef={item}/>
    });
}
const remoteHost = 'http://172.16.12.187:9876'
module.exports ={fetch, transfer2tree,remoteHost,treeLooper}


// var data1 = [{guid: "1", deptcode: '01', deptname: '测试部门01', remark: 'beizhu01', pid: 0, _id: 1, _pid: 0, _title: '测试部门01'},
//     {guid: "2", deptcode: '02', deptname: '测试部门02', remark: 'beizhu02', pid: 1, _id: 2, _pid: 1, _title: '测试部门02'},
//     {guid: "3", deptcode: '03', deptname: '测试部门03', remark: 'beizhu03', pid: 2, _id: 3, _pid: 2, _title: '测试部门03'},
//     {guid: "4", deptcode: '04', deptname: '测试部门04', remark: 'beizhu04', pid: 1, _id: 4, _pid: 1, _title: '测试部门04'}]
//
// console.log(list2tree(data1))
