const initialState = {
    data:[],
    modalVisible:false//模态框可见
}

export default(state = initialState , action) => {
    switch(action.type) {
        case 'getData':
            return Object.assign({}, state, { data: action.json })
            break
        default:
            return state
    }
}