

export const sendMessage = (message) => ({
    type: 'SEND_MESSAGE',
    message
})

export function startChat(data){
    return{
        type: 'SEND_USER',
        data
    }
}

export const startSendMessage = (text) => {

}