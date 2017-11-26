const initState={
    token:'',
    menus:[]
}
export default(state = initState,action)=>{
    switch (action.type){
        case 'GET_USER_DATA':
            return Object.assign({},state,{...action.json})
    }
}