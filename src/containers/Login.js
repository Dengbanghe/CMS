import React from 'react'
import { connect } from 'react-redux'
import { fetch ,remoteHost,transfer2tree} from '../util/common'
import {Button,Icon,Input ,Form} from 'antd'
const FormItem =Form.Item
import {setUserData} from '../actions/loginAction'

class Login extends  React.Component{
    loginSubmit = () =>{
        const {setUserData} = this.props
        const {router} = this.props
        const form = this.props.form
        form.validateFields(async(err,values)=>{
            if(err){
                return
            }
            let result =  await fetch(`${remoteHost}/login`,values)
            let menuTree = transfer2tree(result.menus,{rootId:'menu_0'})
            localStorage.setItem('token',result.token)
            localStorage.setItem('menu',JSON.stringify(menuTree))
            // 菜单交由redux管理
            setUserData(menuTree)

            router.push('/home')
        })
    }
    handleSubmit = (e) =>{
        e.preventDefault()
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{ width: 350,
                height: 340,
                position: 'absolute',
                left:'50%',
                top:'50%',
                marginLeft: -175,
                marginTop: -170}}>
                <Form onSubmit={this.handleSubmit} >
                    <FormItem>
                        {getFieldDecorator('account', {
                            rules: [{required: true, message: '请输入用户名'}]
                        })(
                            <Input placeholder="用户名" prefix={<Icon type="user"/>}/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: '请输入密码'}]
                        })(
                            <Input type='password' placeholder="密码" prefix={<Icon type='lock' />}/>
                        )}
                    </FormItem>
                    <Button type="primary" size="large" onClick={this.loginSubmit} style={{width:350}}>登录</Button>
                </Form>
            </div>
        )
    }



}
const LoginForm = Form.create()(Login);
module.exports = connect(null,{setUserData})(LoginForm)