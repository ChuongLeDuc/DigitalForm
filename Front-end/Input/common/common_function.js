const IP="http://localhost:3000"
let sign_drawing_img_storage=[]
let review_img_storage=[]

const pdf_btn=document.getElementById("pdf-btn")
pdf_btn.addEventListener("click",(e)=>{exportPDF(e.target.name)})

const excel_btn=document.getElementById("excel-btn")
excel_btn.addEventListener("click",(e)=>{
    console.log("TẢI FILE EXCEL...")
    exportExcel("bang-4")
})

const submit_form=document.getElementById("submit-form")
submit_form.addEventListener("submit",e=>{
    //const button=e.submitter.id
    showLoading()

    e.preventDefault()

    let upload_count=0
    let data_upload=false

    try{
        collectTable("bang-4")
        data_upload=true

        if(review_img_storage.length){
            review_img_storage.forEach(img=>{
                const img_id=img.name.split("-")[2]
                uploadImage(img,"review-img","F001-270926-3-"+img_id)
                .then(respone=>{
                    console.log("Upload "+img.name+" thành công")
                })
                .catch(err=>{
                    console.log("Có lỗi xảy ra tại ",img.name,err.message);
                })
                .finally(()=>{
                    upload_count++
                    if(upload_count==review_img_storage.length && data_upload==true)hideLoading()
                })
            })
        }else{
            hideLoading()
        }
    }catch(err){
        alert("Có lỗi khi Upload")
        console.log("Có lỗi xảy ra ",err)
        hideLoading()
    }
})

async function uploadImage(images, img_type, formCode){

    const newForm=new FormData()
    newForm.append("code",formCode)
    newForm.append(img_type,images.img)

    const respone=await fetch("/Upload/image",{
        method:"POST",
        body: newForm
    })

    if(!respone.ok) throw new Error(`${respone.status}:${respone.statusText}`)
    
    return respone
}

function sign_drawing(img){
    const signature_box=document.getElementById("signature-box")
    const signature_canvas=document.getElementById("signature-canvas")
    const pen=signature_canvas.getContext("2d")

    signature_box.style.display="flex"

    const rect=signature_canvas.getBoundingClientRect()
    signature_canvas.width=rect.width
    signature_canvas.height=rect.height

    pen.lineWidth=3;
    pen.lineCap="round"
    pen.lineJoin="round"
    pen.strokeStyle="black"

    let drawing=false;

    function pointerdownHandle(e){
         drawing=true
        
        const x=e.clientX-rect.left
        const y=e.clientY-rect.top

        pen.beginPath()
        pen.moveTo(x,y)
    }
    
    function pointermoveHanlde(e){
        if (!drawing) return

        const x=e.clientX-rect.left
        const y=e.clientY-rect.top

        pen.lineTo(x,y)
        pen.stroke()
    }
    function pointercancelHanlde(e){
        drawing=false
        pen.closePath()
    }

    signature_canvas.addEventListener("pointerdown",pointerdownHandle)
    signature_canvas.addEventListener("pointermove",pointermoveHanlde)
    signature_canvas.addEventListener("pointerup",pointercancelHanlde)

    function deleteBtnHandle(e){
        pen.clearRect(0,0,signature_canvas.width,signature_canvas.height)
    }

    const deleteBtn=document.getElementById("delete-sign-btn")
    deleteBtn.addEventListener("click",deleteBtnHandle)

    function cancelBtnHandle(e){
        signature_box.style.display="none"
        removeEventListener()
    }
    const cancelBtn=document.getElementById("cancel-sign-btn")
    cancelBtn.addEventListener("click",cancelBtnHandle)

    function confirmBtnHandle(e){
        signature_box.style.display="none"
        signature_canvas.toBlob(blob=>{
            const url=URL.createObjectURL(blob)
            img.src=url;
            const sign_drawing_object={"name":img.name,"img":blob}
            sign_drawing_img_storage.push(sign_drawing_object)
        })
        removeEventListener()
    }
    const confirmBtn=document.getElementById("confirm-sign-btn")
    confirmBtn.addEventListener("click",confirmBtnHandle)

    function removeEventListener(){
        signature_canvas.removeEventListener("pointerdown",pointerdownHandle)
        signature_canvas.removeEventListener("pointermove",pointermoveHanlde)
        signature_canvas.removeEventListener("pointerup",pointercancelHanlde)
        deleteBtn.removeEventListener("click",deleteBtnHandle)
        cancelBtn.removeEventListener("click",cancelBtnHandle)
        confirmBtn.removeEventListener("click",confirmBtnHandle)
    }
}

const review_img=document.querySelectorAll(".review-img")
review_img.forEach(img=>{
    const file_input=img.parentElement.querySelector(".review-file")

    img.addEventListener("click",()=>{
        console.log("CLICK IMG:", img.name);
        file_input.click()
    })

    file_input.addEventListener("change",(e)=>{
        const file=file_input.files[0]
        if(!file) return
        const max_size=3
        if(file.size>max_size*1024*1024){
            alert(`Ảnh có kích thước lớn hơn ${max_size} MB.`)
            return
        }

        const review_img_object={"name":img.name, "img":file}
        const index=review_img_storage.findIndex(obj=>obj.name==img.name)
        
        if(index!=-1) review_img_object[index]=review_img_object
        else review_img_storage.push(review_img_object)

        const url=URL.createObjectURL(file)
        img.src=url

        console.log(review_img_storage)
    })
})

const sign_drawing_img=document.querySelectorAll(".sign-img")
sign_drawing_img.forEach(img=>{
    img.addEventListener("click",()=>{
        console.log("CLICK:", img.name);
        sign_drawing(img)
    })
})

function exportPDF(orientation="landscape"){
    const new_style=document.createElement("style")
    new_style.textContent=`
        @page{
            size: A4 ${orientation};
            margin-top:2mm;
            margin-right:1mm;
            margin-left:1mm;
            break-after: page;
            box-sizing: border-box;
        }
        
        .container{
            width:${orientation==="landscape"?"297mm":"210mm"}
            height:${orientation==="landscape"?"210mm":"297mm"}
        }`
    
        document.head.appendChild(new_style)
        window.addEventListener("afterprint",()=>{
            new_style.remove();
        },{once:true})

        window.print()
}

function exportExcel(table) {
}

function getProductionTime() {
    let now = new Date();

    const time = now.getHours() * 60 + now.getMinutes();

    const shift1Start = 6 * 60 + 30;   // 06:30
    const shift2Start = 14 * 60 + 30;  // 14:30
    const shift3Start = 22 * 60 + 30;  // 22:30

    let shift;
    if (time >= shift1Start && time < shift2Start)  shift = 1;
    else if (time >= shift2Start && time < shift3Start) shift = 2;
    else {
        shift = 3;
        if (time < shift1Start) now.setDate(now.getDate() - 1);
    }

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour=now.getHours();
    const minute=now.getMinutes();
    return{
        "year":year,
        "month":month,
        "date":day,
        "hour":hour,
        "minute": minute,
        "shift":shift
    };
}

function calculate_field_total(field_name, fill_position, type_1, type_2) {
    const fields = document.querySelectorAll(`${type_1}[data-field$="${field_name}"]`);
    console.log(`${type_1}[data-field$="${field_name}"]`)
    let total = 0;
    fields.forEach(field => {
        if (field.dataset.field === fill_position) return;
        total += Number(field.value) || 0;
    });

    const fill_cell = document.querySelector(`${type_2}[data-field="${fill_position}"]`);
    if (fill_cell) fill_cell.value = total;
}

function collectTable(table){
    const table_selector=document.getElementById(table)
    const data={}

    table_selector.querySelectorAll("[data-field]").forEach(input=>{
        const field=input.dataset.field
        const rowID=input.dataset.rowid
        const value=input.value

        const parts=field.split(".")

        let current = data
        if(!current[rowID]){
            current[rowID]={}
        }
        current=current[rowID]

        for(let i=0; i<parts.length-1; i++){
            if(!current[parts[i]]){
                current[parts[i]]={}
            }
            current=current[parts[i]]
        }

        const key = parts[parts.length-1]
        current[key]=value
    })

    console.log(data)
    return data
}
