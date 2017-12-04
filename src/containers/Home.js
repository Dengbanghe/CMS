// 计数器
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import {Row,Col,Card} from 'antd'
import { increase, decrease } from '../actions/count'

class MainLayout extends React.Component {
    state = {

    }

    // async componentDidMount() {
    //     let manager = this.state.posts.find(function(ele){
    //         return ele.id == 1;
    //     })
    //     if(manager){
    //         let res = await fetch(`${parent.getRootPath()}/getPending`, {headers: {Accept: 'application/json'}})
    //         let data = await res.json()
    //         this.setState({pendingUserCount:data.pendingUser})
    //     }
    //
    // }

    // loadTreeData =async ()=>{
    //     let res = await fetch(`${parent.getRootPath()}/getEnterTree`, {headers: {Accept: 'application/json'}})
    //     let data = await res.json()
    //     data = data.filter((node) => (node.fRegicode != null))
    //         .map((node) => {
    //             node.disabled = node.fsGuid == null
    //             node.value = node.fsGuid
    //             node.title = node.name
    //             return node
    //         })
    //     this.setState((preState) => (
    //         {enterTreeData: [...data]}
    //     ))
    // }
    //
    // openModal() {
    //     this.loadTreeData();
    //     this.setState((preState) => ({visible: true}))
    // }

    // /**
    //  * 模态框确认按钮
    //  */
    // handleOk(){
    //     let {ssouserid}=this.state
    //     this.form.validateFields(async(err, values)=>{
    //         if(err){return}
    //         this.setState((preState) => ({loading:true}))
    //         let res = await fetch(`${parent.getRootPath()}/setEnterPermission?ssouserid=${ssouserid}&enterGuid=${values.enter}`, {method:'POST',headers: {Accept: 'application/x-www-form-urlencoded'}})
    //         let result = await res.json()
    //         if(res.status==500){
    //             message.error(result.name)
    //         }
    //         if(res.status===200){
    //             this.setState((preState) => ({visible: false,loading:false,userState:1}))
    //         }
    //     })
    // }

    // gotoPendingUserPage = ()=>{
    //     let menu = this.state.menus.find((menu)=>(menu.name=='用户授权'))//todo 菜单数据来源待定
    //     let url='pages/sys_user.html',
    //         menuname='用户授权',
    //         menuid=159
    //
    //     var frame = parent.document.getElementById('iframe-'+menuid)
    //     if(frame){
    //         parent.openNewTab(url,menuname,menuid)
    //         parent.document.getElementById('iframe-'+menuid).contentWindow.subFunction('2')
    //     }else{
    //         parent.openNewTab(url+'?status=2',menuname,menuid)
    //     }
    // }

    saveFormRef = (form)=>{
        this.form = form;
    }

    render() {
        return (
            <div style={{padding: 20}}>
                <Row>
                    <Col span={24}></Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Card title="待办事项"  style={{width: '100%',minHeight:200}}>

                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="通知" extra={<a href="#">更多</a>} style={{width: '100%',minHeight:200}}>
                            <a>暂无</a>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

class Home extends Component {
    render() {
        const { number, increase, decrease } = this.props

        return (
            <div>
                <p>这里显示的是当前值: <span className="badge">{number}</span></p>
                <br />
                <button type="button" className="btn btn-default" onClick={() => increase(1)}>+1按钮</button>
                { ' ' }
                <button type="button" className="btn btn-default" onClick={() => decrease(1)}>-1按钮</button>
                { ' ' }
                <button type="button" className="btn btn-default" onClick={() => browserHistory.push('/foo')}>跳转到 /foo</button>
            </div>
        )
    }
}

const getNumber = state => {
    return {
        number: state.update.number
    }
}

module.exports = connect(
    // getNumber,
    // { increase, decrease }
)(MainLayout)