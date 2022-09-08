function init(){

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('logout').addEventListener('click', e => {
        document.cookie = `token=;SameSite=Lax`;
        window.location.href = 'login.html';
    });
}