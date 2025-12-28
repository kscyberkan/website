import auth from "../function"
import { type RegisterData } from "../../types/register_data";
import { type LoginData } from "../../types/login_data";

function SendRegister(registerData: RegisterData) {
    const loginData: LoginData = {
        username: registerData.username,
        password: registerData.password
    }
    auth.setLoginData(loginData)
}

const register = {
    Register: SendRegister
}

export default register
