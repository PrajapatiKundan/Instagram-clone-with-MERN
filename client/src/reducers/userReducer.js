export const initialState = null

export const reducer = (state, action) =>{
        
    if(action.type === "USER"){
        return action.payload
    }
    if(action.type === "LOGOUT"){
        return null
    }
    if(action.type === "UPDATE"){
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }
    if(action.type === "UPDATEPROFILE"){
        return {
            ...state,
            profile_pic: action.payload,
        }
    }
    return state
}