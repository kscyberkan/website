import auth from "../function"

function SendLogin(username: string, password: string) {
    auth.setLoginData({username, password})
}

const login = {
    Login: SendLogin
}

export default login
