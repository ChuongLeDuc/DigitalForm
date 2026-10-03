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

// Update Data for Table 2
const time=getProductionTime()
const year=String(time.year).padStart(2,"0")
const month=String(time.month).padStart(2,"0")
const date=String(time.date).padStart(2,"0")
const shift="Ca "+ String(time.shift)

document.getElementById("ngay-cap").value=`${date}-${month}-${year}`
document.getElementById("ca").value=shift


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
            new_html+=`<td colspan='10'><input type='time' data-field='${lowerCase(line)}.${lowerCase(machine)}.gio-cap' data-rowid=${row_ID} class='color-4-9 timePickerText' disabled></td>`
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