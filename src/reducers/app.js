const initialState = {
    menus:[],
    breadcrumbList: [{key:'主页',path:'/home'}],
}

// 通过dispatch action进入
export default function app(state = initialState, action) {
    // 根据不同的action type进行state的更新
    switch(action.type) {
        case 'changeBreadcrumb':
            return Object.assign({}, state, { breadcrumbList: action.array })
            break
        default:
            return state
    }
}