function userOnline(user){
    console.log(`用户${user}上线拉`);
    console.log(`当前的online-users${JSON.stringify(online_users)}`)
};

function userOffline(user){
    console.log(`用户${user}下线拉`);
    console.log(`当前的online-users${JSON.stringify(online_users)}`)
};

function getUserOnlineState(user){
    console.log(`在线users: ${JSON.stringify(online_users)}`)
}

module.exports = {
    userOnline,
    userOffline,
    getUserOnlineState,
}