const mockLoginResponse = {
    userInfo: {
        uid: 123,
        username: "jaycehhh",
        avatar: "",
        userDetails: "hello, this is jayce",
    },
    success: true,
};

const mockLoginUnmatchPasswordResponse = {
    success: false, 
    message: "密码错误"
};

const mockLogoutResponse = {
    success: true, 
    message: "登出"
};

const mockRegisterResponse = {
    success: true, 
    message: "用户注册成功"
};

const mockRegisterFailResponse = {
    success: false, 
    message: "用户注册失败"
};


module.exports = {
    mockLoginResponse,
    mockLogoutResponse,
    mockLoginUnmatchPasswordResponse,
    mockRegisterResponse,
    mockRegisterFailResponse,
}

