function go() {
    const data = document.getElementById("data");
    const size = document.getElementById("size");
    const qrimg = document.getElementById("qrimg");
    
    const dataval = data.value.trim();
    if (dataval) {
        qrimg.src = "https://api.qrserver.com/v1/create-qr-code/?size=" + size.value + "&data=" + encodeURIComponent(dataval);
        console.log("Input text:", dataval);
        console.log("Size of QR image:", size.value);
    } else {
        alert("Please enter text to generate a QR code!");
    }
}
