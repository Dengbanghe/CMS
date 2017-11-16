const initialState = {
    data:[],
    modalVisible:false//模态框可见
}

export default(state = initialState , action) => {
    switch(action.type) {
        case 'GET_DATA_PENDING' :
            return state; // 可通过action.payload.data获取id
        case 'GET_DATA_FULFILLED' :
            console.log(123123)
            return Object.assign({}, state, { data:action.payload})
        case 'GET_DATA_REJECTED' :
            return errorState;
        default:
            return state
    }
}