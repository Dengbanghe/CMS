import React, { Component } from 'react'
import { connect } from 'react-redux'

class NotFoundPage extends Component {
    render() {
        return (
            <h1>404</h1>
        )
    }
}

module.exports = connect()(NotFoundPage)