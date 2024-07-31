export function init_send_pic(){
    // console.log("send_pic")
    let pic_btn = document.getElementById("pic-btn");
    pic_btn.addEventListener("click", ()=>{
        const pic_input = document.querySelector("#pic-input");
        pic_input.click();
    });

    document.getElementById('pic-input').addEventListener('change', function() {
        let file = this.files[0];
        if (file) {
            // 在这里可以进一步处理文件，比如上传到服务器
            console.log(file);
        }
    });
}