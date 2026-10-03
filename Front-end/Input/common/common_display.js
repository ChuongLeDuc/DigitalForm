function displayTimePicker(item) {
    const position = item.getBoundingClientRect();
    console.log(position.left);

    item.addEventListener("click",(e)=>{
        item.type="time"
        item.showPicker()
    })

    item.addEventListener("blur",(e)=>{
        item.type="text"
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