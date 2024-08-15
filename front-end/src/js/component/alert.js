export function showAlertBox(msg){
    var alertBox = document.getElementById('alertBox');
    alertBox.classList.remove('d-none');
    alertBox.classList.add('show');
    alertBox.textContent = msg;

    return new Promise((resolve) => {
        setTimeout(function() {
            alertBox.classList.remove('show');
            alertBox.classList.add('d-none');
        }, 2000);
    });
}