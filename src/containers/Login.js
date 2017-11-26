import React from 'react'
import { connect } from 'react-redux'
import { fetch ,remoteHost} from '../util/common'
import  getUserData from '../actions/login'
import {Button,Icon,Input ,Form} from 'antd'
const FormItem =Form.Item

class Login extends  React.Component{

    loginSubmit = () =>{
        const {router} = this.props
        const form = this.props.form
        form.validateFields(async(err,values)=>{
            if(err){
                return
            }
            let data={}
            getUserData(data)
            router.push('/home')
        })
    }
    handleSubmit = (e) =>{
        e.preventDefault()
        console.log(this.props.form)
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
                <Form onsubmit={this.handleSubmit} >
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
module.exports = connect()(LoginForm)