function displayTimePicker(item) {
    console.log("Original: ",item.type);

    item.addEventListener("click",(e)=>{
        item.type="time"
        item.showPicker()
        console.log(item.type,"Click")

    })
    
    item.addEventListener("change",(e)=>{
        item.type="text"
        console.log("text",item.value)
    })
}

function showLoading(){
    document.getElementById("loading-div").style.display="flex"
}
function hideLoading(){
    document.getElementById("loading-div").style.display="none"
}