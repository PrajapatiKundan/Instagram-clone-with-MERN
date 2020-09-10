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
    return state
}