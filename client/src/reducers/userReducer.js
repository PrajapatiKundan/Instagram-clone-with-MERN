export const initialState = null

export const reducer = (state, action) =>{
    //state is the current state
    //action is object it has two part {
    //     type:"what operation to be performed"
    //     payload:"on which data operation to be performed"
    // }
    if(action.type === "USER"){
        return action.payload
    }
    if(action.type === "CLEAR"){
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