async function getFullname(){
    const getName=await fetch("/api/users")
    console.log(getName.ok)
    if(!getName.ok){
        alert("Không thể lấy thông tin người dùng")
        window.location.href="/Input"
    }

    const nameResult= await getName.json()
    document.getElementById("username").textContent=nameResult.fullname
}

getFullname()

async function getApproveForm(){
    const request = await fetch("/api/forms/list/AP"); 
    const result = await request.json();

    const data = result.data;
    const tbody = document.getElementById("history-table-body");
    console.log("DATA: ",data)
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">KHÔNG CÓ DỮ LIỆU</td>
            </tr>
        `;
        return;
    }

    data.forEach(items=> {
        items.forEach(item=>{
            const tr = document.createElement("tr");

            tr.innerHTML = `
            <td><a href='/View/approve/${item.submission_code}'>${item.submission_code}</a></td>
            <td>${item.recorded_date}</td>
            <td>CA ${item.shift}</td>
            <td>${item.status}</td> `;

            tbody.appendChild(tr);
        })
    });
}
getApproveForm()
const logoutBtn =document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
    window.location.href = "/Login/logout";
});