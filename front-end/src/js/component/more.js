export function initMoreBtn(){
    const more_btn = document.querySelector("#more-btn");
    more_btn.addEventListener('click', function() {
        const more = document.querySelector("#more");
        if(!more.style.display || more.style.display == "none"){
            more.style.display = "block";
        }else if(more.style.display == "block"){
            more.style.display = "none";
        }        
    });
}
