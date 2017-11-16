// reducers/index.js
import { combineReducers } from 'redux' // 利用combineReducers 合并reducers
import { routerReducer } from 'react-router-redux' // 将routerReducer一起合并管理
import update from './count' // 引入update这个reducer
import app from './app.js' // 引入update这个reducer
import regicodeMgmt from './regicodeMgmt.js' // 引入update这个reducer

export default combineReducers({
    regicodeMgmt,
    app,
    update,
    routing: routerReducer
})