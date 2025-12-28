import storage from "../../utils/storage"
import { type LoginData } from "../types/login_data";
import { authFunction } from "./auth";

const loginDataKey = "loginData";


function setLoginData(data: LoginData) {
    authFunction.setLoginData(data);
    storage.setToStorage(loginDataKey, JSON.stringify(data))
}

function removeLoginData() {
    storage.removeFromStorage(loginDataKey);
    authFunction.setLoginData(false);
}

function getLoginData(): LoginData | false {

    const loginDataRaw = storage.getFromStorage(loginDataKey);

    const loginData = loginDataRaw ? JSON.parse(loginDataRaw) as LoginData : null;

    if (loginData) {
        return loginData;
    } else {
        return false;
    }
}

const auth = {
    setLoginData,
    getLoginData,
    removeLoginData,
}

export default auth
