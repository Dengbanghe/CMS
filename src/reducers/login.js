const initState = {
    menus:[]
}

export default (state = initState, action)=>{
    console.log(`action.type`)
    console.log(action.type)
    console.log(action.json)
    switch (action.type){
        case 'SET_USER_DATA':
            return Object.assign({},state,{menus:action.json})
            break
        default:
            return state
    }
}