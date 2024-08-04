const mockLoginResponse = {
    userInfo: {
        userId: "123",
        username: "jaycehhh",
        userAvatar: "",
        userDetails: "hello, this is jayce",
    },
    success: true,
};

const mockLoginUnmatchPasswordResponse = {
    success: false, 
    message: "密码错误"
};

const mockLoginNoExistResponse = {
    success: false, 
    message: "用户不存在！" // 根据查询的键值初始化message
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
    mockLoginNoExistResponse
}

