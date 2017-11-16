import fetch from  'isomorphic-fetch';

export const getData1 = (promise)=>{
    return {
        type: 'GET_DATA',
        payload: ( async()=>{
            let res = await fetch('data.json');
            let data = await res.json();
            return data })()
    }
}
