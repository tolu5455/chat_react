const initialState = {
    data: {},
    message: {}
}

const chatReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SEND_USER':
            return{...state,
                data: action.data
            }
        case 'SEND_MESSAGE':
            return{...state,
                message: [action.message]
            }
        default:
            return state
    }
}

export default chatReducer