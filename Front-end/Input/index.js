async function loadPermissionForm() {
    try{
        const permission_form=await fetch("/api/forms");
        if(!permission_form.ok){
            console.log("Có lỗi trong quá trình truy vấn")
            return
        }
        const respone=await permission_form.json()
        const forms=respone.data
        console.log(forms)
        let html=""
        forms.forEach(form=>{
            const form_code=form["form_code"]
            html+=`<a href='/View/new/${form_code}'>${form_code}</a>`
        })
        document.getElementById("form-bounding-div").innerHTML=html

    }catch(err){
        console.log("Có lỗi trong quá trình truy vấn")
    }

}

loadPermissionForm()

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

async function getHistoryForm(){ 
    const request = await fetch("/api/forms/list/OP"); 
    const result = await request.json();

    const data = result.data;
    const tbody = document.getElementById("history-table-body");

    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">KHÔNG CÓ DỮ LIỆU</td>
            </tr>
        `;
        return;
    }

    data.forEach(item => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><a href='/View/review/${item.submission_code}'>${item.submission_code}</a></td>
            <td>${item.recorded_date}</td>
            <td>CA ${item.shift}</td>
            <td>${item.status}</td>
        `;

        tbody.appendChild(tr);
    });
}

getHistoryForm()

const logoutBtn =document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
    window.location.href = "/Login/logout";
});