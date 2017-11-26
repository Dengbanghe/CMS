export const getUserData=(json)=>{
    return {
        type:'GET_USER_DATA',
        json
    }
}

module.exports = {getUserData}