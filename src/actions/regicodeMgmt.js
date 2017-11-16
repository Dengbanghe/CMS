import 'whatwg-fetch'

export const getData = (json)=>{
    return {
        type: 'getData',
        json
    }
}

// function fetchPosts() {
//     return dispatch => {
//         return fetch('data.json')
//             .then((res) => { console.log(res.status); return res.json() })
//             .then((array) => {
//                 dispatch(getData(array))
//             })
//             .catch((e) => { console.log(e.message) })
//     }
// }
function fetchPosts() {
    return dispatch => {
        return fetch('data.json')
            .then((res) => { console.log(res.status); return res.json() })
            .then((data) => {
                console.log(data)
                dispatch(getData(data))
            })
            .catch((e) => { console.log(e.message) })
    }
}

// 这里的方法返回一个函数进行异步操作
export function fetchPostsIfNeeded() {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(fetchPosts())
    }
}