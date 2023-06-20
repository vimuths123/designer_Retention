export const login = async (token) => {
    localStorage.setItem('logintoken', token);
};

export const logout = () => {
    localStorage.removeItem('logintoken');
};

export const checkLogin = async () => {
    const hasToken = await localStorage.getItem('logintoken') !== null;
    if (hasToken) {
        return true;
    } else {
        return false
    }
};

export const getToken = async () => {
    const hasToken = await localStorage.getItem('logintoken') !== null;
    if (hasToken) {
        return true;
    } else {
        return false
    }
};