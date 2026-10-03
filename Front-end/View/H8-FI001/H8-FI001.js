const header={
    "Line 1":{
        "Máy 5":{"SKU":["","1KG","900G"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
        "Máy 6":{"SKU":["","1KG","900G"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
    },

    "Line 2":{
        "Máy 1":{"SKU":["","400G","454G"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
        "Máy 2":{"SKU":["","400G","454G"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
    },

    "Line 3":{
        "Máy 100G1":{"SKU":["","1KG","900G"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
        "Máy 100G2":{"SKU":["","1KG","900G"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
    },

    "Line 5":{
        "Máy 230G":{"SKU":["","230G","454G"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
    },

    "Line 6":{
        "Máy 7":{"SKU":["","1KG","900G","1.8KG"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
        "Máy 8":{"SKU":["","1KG","900G","1.8KG"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
    },

    "Line 7":{
        "Máy 100G1":{"SKU":["","1KG","900G"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
        "Máy 100G2":{"SKU":["","1KG","900G"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
    },

    "Line 8":{
        "Máy 230G":{"SKU":["","230G","454G"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
    },

    "Line 9":{
        "Máy 7":{"SKU":["","1KG","900G","1.8KG"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
        "Máy 8":{"SKU":["","1KG","900G","1.8KG"],"seed-type":["","LC","RC"],"LOT":["","2023915-1","20231315-2","2023115-3"]},
    }
}

// Update Data for Table 4
// Table 4 Header
const table_4_head=document.getElementById("bang-4-head")
let new_html="<tr><td rowspan='2' colspan='7' class='color-4-1'>STT</td>"

let head_id=1
Object.keys(header).forEach(line=>{
    Object.keys(header[line]).forEach(machine=>{
        let row_ID="head-"+String(head_id).padStart(3,"0")
        new_html+=`<td colspan=15 class='color-4-1'>${line}</td>`
        new_html+= `<td colspan=10 class='color-4-1'>${machine}</td>`
        new_html+=`<td colspan='10'><select data-field="${lowerCase(line)}.${lowerCase(machine)}.sku" data-rowid=${row_ID} class='color-4-3'>`
        header[line][machine]["SKU"].forEach(sku=>{
            new_html+=`<option value=${sku}>${sku}</option>`
        })
        new_html+=`</select></td>`

        new_html+=`<td colspan='10'><select data-field="${lowerCase(line)}.${lowerCase(machine)}.seed-type" data-rowid=${row_ID} class='color-4-4'>`
        header[line][machine]["seed-type"].forEach(seed=>{
            new_html+=`<option value=${seed}>${seed}</option>`
        })
        new_html+=`</select></td>`
    })
})

new_html+="</tr><tr class='color-4-5'>"
Object.keys(header).forEach(line=>{
    Object.keys(header[line]).forEach(machine=>{
        new_html+=`<td colspan=15>Lot.Bulk</td>`
        new_html+=`<td colspan=10>Số bao CB</td>`
        new_html+=`<td colspan='10'>Khối lượng</td>`
        new_html+=`<td colspan='10'>Giờ cấp</td>`
    })
})

new_html+="</tr>"
table_4_head.innerHTML=new_html

// Table 4 - Body
const table_4_body=document.getElementById("bang-4-body")
new_html=""

for(let body_id=0; body_id<45; body_id++){
    let row_ID="body-"+String(body_id+1).padStart(3,"0")
    new_html+=`<tr><td colspan='7'>${body_id+1}</td>`
    Object.keys(header).forEach(line=>{
        Object.keys(header[line]).forEach(machine=>{
            new_html+=`<td colspan='15'><select data-field='${lowerCase(line)}.${lowerCase(machine)}.lot-bulk' data-rowid=${row_ID}></select></td>`
            new_html+=`<td colspan='10'><input type='number' data-field='${lowerCase(line)}.${lowerCase(machine)}.so-bao-cb' data-rowid=${row_ID} disabled></td>`
            new_html+=`<td colspan='10'><input type='number' data-field='${lowerCase(line)}.${lowerCase(machine)}.khoi-luong' data-rowid=${row_ID} disabled></td>`
            new_html+=`<td colspan='10'><input type='${window.matchMedia("(pointer: fine").matches?'text':'time'}' data-field='${lowerCase(line)}.${lowerCase(machine)}.gio-cap' data-rowid=${row_ID} class='color-4-9 timePickerText' disabled></td>`
        })
    })
    
    new_html+="</tr>"
}
table_4_body.innerHTML=new_html

// Table 4 - Footer
const table_4_footer=document.getElementById("bang-4-foot")
new_html="<tr><td colspan='7' class='color-4-6'></td>"
let footer_id=1
Object.keys(header).forEach(line=>{
    Object.keys(header[line]).forEach(machine=>{
        let row_ID="footer-"+String(footer_id).padStart(3,"0")
        new_html+=`<td colspan='15' class='color-4-1'><b>Tổng</b></td>`
        new_html+=`<td colspan='10'><input type='number' data-field='${lowerCase(line)}.${lowerCase(machine)}.tong-so-bao-cb' data-rowid=${row_ID} disabled class='color-4-7'></td>`
        new_html+=`<td colspan='10'><input type='number' data-field='${lowerCase(line)}.${lowerCase(machine)}.tong-khoi-luong' data-rowid=${row_ID} disabled class='color-4-8'></td>`
        new_html+=`<td colspan='10' class='color-4-6'></td>`
    })
})
new_html+="</tr>"
table_4_footer.innerHTML=new_html
//--------------------------------------------------------

const lots=document.querySelectorAll("select[data-field$='.lot-bulk']")
lots.forEach(lot=>{
    const fieldName=String(lot.dataset.field).split(".")
    
    const line = fieldName[0].replace("line-", "Line ");
    const machine = "Máy " + fieldName[1].replace("may-", "").toUpperCase();

    const LOT_OPTIONS=header[line][machine]["LOT"]
    LOT_OPTIONS.forEach(lot_option=>{
        const option=document.createElement("option")
        option.value=lot_option
        option.textContent=lot_option
        lot.appendChild(option)
    })

    lot.addEventListener("change",function(){
        if (this.value!=""){
            document.querySelector(`select[data-field='${fieldName[0]}.${fieldName[1]}.sku']`).required=true;
            document.querySelector(`select[data-field='${fieldName[0]}.${fieldName[1]}.seed-type']`).required=true;
            
            this.closest("tr").querySelector(`input[data-field='${fieldName[0]}.${fieldName[1]}.so-bao-cb']`).required=true;
            this.closest("tr").querySelector(`input[data-field='${fieldName[0]}.${fieldName[1]}.so-bao-cb']`).disabled=false;
 
            this.closest("tr").querySelector(`input[data-field='${fieldName[0]}.${fieldName[1]}.khoi-luong']`).required=true;
            this.closest("tr").querySelector(`input[data-field='${fieldName[0]}.${fieldName[1]}.khoi-luong']`).disabled=false;

            const timeinput=this.closest("tr").querySelector(`input[data-field='${fieldName[0]}.${fieldName[1]}.gio-cap']`)
            timeinput.required=true;
            timeinput.disabled=false;
            
            if(window.matchMedia("(pointer: fine").matches) displayTimePicker(timeinput)

        }else{
            this.closest("tr").querySelectorAll('input').forEach(input=>{
                input.value=""
                input.disabled=false
            })
        }
    })
})

const cb_bag=document.querySelectorAll('input[data-field$=".so-bao-cb"]')
cb_bag.forEach(bag=>{
    bag.addEventListener("input",()=>{
        const fieldName=String(bag.dataset.field).split(".")
        const collectField=`${fieldName[0]}.${fieldName[1]}.so-bao-cb`
        const fillField=`${fieldName[0]}.${fieldName[1]}.tong-so-bao-cb`
        calculate_field_total(collectField,fillField,"input","input")
    })
})

const weight=document.querySelectorAll('input[data-field$=".khoi-luong"]')
weight.forEach(bag=>{
    bag.addEventListener("input",()=>{
        const fieldName=String(bag.dataset.field).split(".")
        const collectField=`${fieldName[0]}.${fieldName[1]}.khoi-luong`
        const fillField=`${fieldName[0]}.${fieldName[1]}.tong-khoi-luong`
        calculate_field_total(collectField,fillField,"input","input")
    })
})

//collectTable("bang-4")
// Form 1 functions

function lowerCase(text){
    text=text.normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    return String(text).toLowerCase().replace(" ","-")
}

const mode=String(window.location.pathname).split("/")[2]
let form_code=String(window.location.pathname).split("/")[3]
let submission_code=String(window.location.pathname).split("/")[3]

if(mode==="review" || mode==="approve"){
    const separation=form_code.split("-")
    form_code=separation[0]+"-"+separation[1]
}

if(!["new","approve","review"].includes(mode)) window.location.href="/Input"
const getName=await fetch("/api/users")
console.log(getName.ok)
if(!getName.ok){
    alert("Không thể lấy thông tin người dùng")
    window.location.href="/Input"
}

const nameResult= await getName.json()
const fullname=nameResult.fullname
const signname=nameResult.signname
document.getElementById("username").textContent=fullname

const checkPermission = await fetch("/api/users/"+form_code)
if(!checkPermission.ok){
    alert("Có lỗi trong quá trình xử lý")
    window.location.href="/Input"
}

const result=await checkPermission.json()
console.log("Message: ",result.message)
if(!result.status==200){
    alert(result.message)
    window.location.href="/Input"
}

const userRole=result.roles

//http://192.168.0.209:3000/View/new/H8-FI001
if(mode==="new"){

    document.getElementById("approve-btn").style.display="none"
    document.getElementById("reject-btn").style.display="none"
    console.log(mode,form_code)
    // Update Data for Table 2
    const time=getProductionTime()
    const year=String(time.year).padStart(2,"0")
    const month=String(time.month).padStart(2,"0")
    const date=String(time.date).padStart(2,"0")
    let shift=String(time.shift)
    
    let dateString
    const params = new URLSearchParams(window.location.search);
    if(params.size==2){
        dateString = params.get("date");
        shift = params.get("shift");
    }else{
        dateString=`${date}-${month}-${year}`
    }

    document.getElementById("recorded-date").value=dateString
    document.getElementById("shift").value="Ca "+shift

    const OP_check=userRole.some(role=>role.role_code==="OP")
    
    if(!OP_check){
        alert("Không có quyền chỉnh sửa Form")
        window.location.href="/Input"
    }

    const date_recorded=document.getElementById("recorded-date").value.split("-")
    const shift_recorded=document.getElementById("shift").value.split(" ")
    submission_code=`${form_code}-${date_recorded[0]}${date_recorded[1]}${date_recorded[2].slice(2,4)}-${shift_recorded[1]}`
    const [row,check]=await getFormData(submission_code)
    console.log(row)

    if(check){
        if(row.status.includes("AP")) window.location.href="/View/review/"+row.submission_code
        fillFormData(row.data)

        if(row.status==="SUBMIT"){
            document.getElementById("draft-btn").style.display="none"
        }

        document.getElementById("comment").value=row.comment
        document.getElementById("header-formcode").textContent=row.submission_code
        document.getElementById("form-status").textContent=row.status
    }

    document.querySelectorAll(`img.OP`).forEach(OP_img=>{
        const field=OP_img.name
        OP_img.style.background="#b4f5b4"
    
        OP_img.addEventListener("click",e=>{
            if(confirm("Xác nhận chữ ký?")){
                const img_path=`/Images/Signatures/${signname}`
                OP_img.src=img_path
                document.querySelector(`input[data-field='${field}']`).value=img_path
                const input_name=String(field).replaceAll("anh-chu-ky","ten")
                document.querySelector(`input[data-field='${input_name}']`).value=fullname
            }
        })
    })

}

//http://192.168.0.209:3000/View/new/H8-FI001
if(mode==="approve"){
    console.log(mode,submission_code,"vrbe")
    document.getElementById("draft-btn").style.display="none"
    document.getElementById("submit-btn").style.display="none"
    const AP_check=userRole.some(role=>role.role_code.includes("AP"))
    console.log("HUHU",userRole,AP_check)
    if(!AP_check){
        alert("Không có quyền phê duyệt Form")
        window.location.href="/Approve"
    }
    const AP_role=userRole[0].role_code
    //const [data,check]=getFormData(`H8-FI001-290926-2`)
    const [row,check]=await getFormData(submission_code)
    console.log(submission_code,AP_role)

    if(check){
        if(row.status==="REJECT" || row.status==="APPROVE") window.location.href="/View/review/"+row.submission_code
        const level=Number(row.status.split("-")[1])
        if(AP_role.split("-")[1]!=="F"){
            const userlevel=Number(row.status.split("-")[1])
            if(level-userlevel>=0) window.location.href="/View/review/"+row.submission_code
        }
        
        fillFormData(row.data)
        document.getElementById("comment").value=row.comment

        document.getElementById("header-formcode").textContent=row.submission_code
        document.getElementById("form-status").textContent=row.status

        document.querySelectorAll(`img.${AP_role}`).forEach(AP_img=>{
            const field=AP_img.name
            AP_img.style.background="#b4f5b4"
            const input_name=String(field).replaceAll("anh-chu-ky","ten")
            AP_img.addEventListener("click",e=>{
                if(confirm("Xác nhận chữ ký?")){
                    const img_path=`/Images/Signatures/${signname}`
                    AP_img.src=img_path
                    document.querySelector(`input[data-field='${field}']`).value=img_path
                    document.querySelector(`input[data-field='${input_name}']`).value=fullname
                }
            })
        })

    }else{
        alert("Form không tồn tại")
        window.location.href="/Approve"
    }
    
}

if(mode==="review"){
    document.getElementById("draft-btn").style.display="none"
    document.getElementById("submit-btn").style.display="none"
    document.getElementById("approve-btn").style.display="none"
    document.getElementById("reject-btn").style.display="none"
    const [row,check]=await getFormData(submission_code)
    if(check){
        fillFormData(row.data)
        document.getElementById("comment").value=row.comment

        document.getElementById("header-formcode").textContent=row.submission_code
        document.getElementById("form-status").textContent=row.status
        document.querySelectorAll("input").forEach(input=>{
            input.disabled=true
        })
        document.querySelectorAll("select").forEach(select=>{
            select.disabled=true
        })
    }else{
        alert("Form không tồn tại ")
        window.location.href="/Input"
    }

}

async function getFormData(submission_code){ //"H8-FI001-300926-3"
    const getForm = await fetch("/api/forms/"+submission_code)
    console.log(submission_code, getForm.status)

    if(!getForm.ok){
        alert("Có lỗi trong quá trình kiểm tra dữ liệu")
        window.location.href="/Input"
    }

    const result = await getForm.json()
    console.log("Message",result.message)

    if(!result.status==200){
        alert(result.message)
        window.location.href="/Input"
    }

    return [result.rowData, result.exist]
}

function fillFormData(data) {
    Object.entries(data).forEach(([tableId, tableData]) => {
        if(tableId.includes("image")){
            console.log(tableId)
            Object.keys(data[tableId]).forEach(row=>{
                console.log("OK",data[tableId][row])
                Object.keys(data[tableId][row]).forEach(field=>{
                    const img_path=data[tableId][row][field]
                    console.log(img_path)
                    if(img_path!=="") document.querySelector(`img[name='${field}']`).src=img_path
                })
                
            })
        }
        const table = document.getElementById(tableId);
        if (!table) return;
        Object.entries(tableData).forEach(([rowId, rowData]) => {
            fillRowData(table, rowId, rowData);
        });
    });
}


function fillRowData(table, rowId, data, path = "") {
    Object.entries(data).forEach(([key, value]) => {
        const currentPath = path? `${path}.${key}`: key;

        if (value !== null &&typeof value === "object" &&!Array.isArray(value)) {
            fillRowData(table,rowId,value,currentPath);
            return;
        }
        // Đã tới giá trị cuối
        const element = table.querySelector(`[data-rowid="${rowId}"][data-field="${currentPath}"]`);

        if (!element) return;
        element.value = value ?? "";
        if(element.value!="")element.disabled=false
    });
}