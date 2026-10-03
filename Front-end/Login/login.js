const btn = document.getElementById("login-btn");
btn.addEventListener("click", async () => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/Login/login", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const result = await response.json();
    if(result.success){
        window.location.href=result.returnTo
    }else document.getElementById("error-message").textContent="Thông tin đăng nhập sai"
});