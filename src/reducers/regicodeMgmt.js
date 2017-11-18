const initialState = {
    data:[],
    modalVisible:false//模态框可见
}

export default(state = initialState , action) => {
    switch(action.type) {
        case 'GET_DATA_PENDING':
            return state
        case 'GET_DATA_FULFILLED':
            return Object.assign({}, state, { data: action })
        case 'GET_DATA_REJECTED':
            return {...state, myActionLoading: false}
        default:
            return state
    }
}