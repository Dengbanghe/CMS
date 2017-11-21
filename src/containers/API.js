import React from 'react'
import {connect} from 'react-redux'
import apiHtml from '../../API.md'

class Api extends  React.Component{
    render(){
        return (
            <div dangerouslySetInnerHTML={{__html:apiHtml}}></div>
        )
    }
}

module.exports = connect()(Api)