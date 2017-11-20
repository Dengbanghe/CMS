import React, { Component } from 'react' // 引入React
import { Link } from 'react-router' // 引入Link处理导航跳转
import { connect } from 'react-redux'
import '../../assets/css/App.css'
import{changeBreadcrumb} from'../actions/appAction'
import { Menu, Breadcrumb, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

 class App extends Component {
    render() {
        const {breadcrumbList,changeBreadcrumb} = this.props
        return(
        <div style={{width:'100%',height:'100%'}}>
        <div className="ant-layout-aside">
            <aside className="ant-layout-sider" >
                <div className="ant-layout-logo"></div>
                <Menu mode="inline" theme="dark"
                      defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}
                      onClick={clickMenu}
                      onSelect={selectMenu}>
                    <Menu.Item key="sub1" ><Link to="/index" activeStyle={{textDecoration:'none'}} ><Icon type="user"/>我的主页</Link></Menu.Item>
                    <SubMenu key="sub2" title={<span><Icon type="laptop" />基础数据管理</span>}>
                        <Menu.Item key="5"><Link to="/region">行政区划管理</Link></Menu.Item>
                        <Menu.Item key="6">金融机构</Menu.Item>
                        <Menu.Item key="7">贷款机构</Menu.Item>
                        <Menu.Item key="8">贷款类型</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title={<span><Icon type="notification" />权限管理</span>}>
                        <Menu.Item key="9"><Link to="/dept">岗位管理</Link></Menu.Item>
                        <Menu.Item key="10">岗位管理</Menu.Item>
                        <Menu.Item key="11">菜单管理</Menu.Item>
                        <Menu.Item key="12"><Link to="/user">用户管理</Link></Menu.Item>
                    </SubMenu>
                </Menu>
            </aside>
            <div className="ant-layout-main">
                <div className="ant-layout-header"></div>
                <div className="ant-layout-breadcrumb">

                    <Breadcrumb>
                        {/*{*/}
                            {/*breadcrumbList.map((item,i)=>{*/}
                                {/*return (<Breadcrumb.Item>{item.name}</Breadcrumb.Item>)*/}
                            {/*})*/}
                        {/*}*/}
                        <Breadcrumb.Item><Link to="/index">首页</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="ant-layout-container">
                    <div className="ant-layout-content">
                        <div style={{ height: window.innerHeight -200 }}>
                            { this.props.children }
                        </div>
                    </div>
                </div>
                <div className="ant-layout-footer">
                    网盛数新©提供技术支持
                </div>
            </div>
        </div>
        </div>
        )
    }
}
const clickMenu=({item,key,keyPath})=>{
     // console.log(item);
     // console.log(key);
     // console.log(keyPath);
 }
 const selectMenu=({ item, key })=>{
    //  console.log(item);
    // console.log(key);
    // console.log(keyPath);
 }
const getBreadcrumbList = state => {
    return {
        breadcrumbList: state.app.breadcrumbList
    }
}

module.exports =  connect(getBreadcrumbList,{changeBreadcrumb})(App)