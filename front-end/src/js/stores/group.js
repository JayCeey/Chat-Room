import DefaultAvatar from "assets/images/default_avatar.jpg";

function setGroupDefaultAvatar(groupInfo){
    if(!groupInfo.groupAvatar || groupInfo.groupAvatar == ""){
        // console.log(`设置默认头像${DefaultAvatar}`)
        groupInfo.groupAvatar = DefaultAvatar;
    }
};

export function handleGroupInfo(groupInfo){
    setGroupDefaultAvatar(groupInfo);
}
