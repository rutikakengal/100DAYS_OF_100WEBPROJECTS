document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById("filepicker");
    const innerImage = document.querySelector(".inner-upload");
    const InputImage = document.getElementById("input-image");
    const placeholder = document.querySelector(".place-holder");
    const genImg = document.getElementById("generated-image");
    const uploadbtn = document.querySelector("#upload-btn");
    const section2_2 = document.querySelector(".sec2-2");
    const section2_3 = document.querySelector(".sec2-3");
    const loading = document.querySelector("#loading");
    const downloadbtn = document.querySelector("#download-btn");
    const resetbtn = document.querySelector("#reset-btn");

    // State variables
    let image = null;
    let url = null;

    // Event Listeners
    innerImage.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", handleFileSelect);
    uploadbtn.addEventListener("click", handleUpload);
    downloadbtn.addEventListener("click", handleDownload);
    resetbtn.addEventListener("click", handleReset);

    // Functions
    function handleFileSelect() {
        image = fileInput.files[0];
        if (!image) return;

        // Validate file type
    const reader = new FileReader();
        reader.onload = function(e) {
            InputImage.src = e.target.result; // Simplified data URL handling
            InputImage.style.display = "block";
            placeholder.style.display = "none";
        };
        reader.readAsDataURL(image);
    }

    function handleUpload() {
        if (!image) {
            alert("Please select an image first");
            return;
        }

        loading.style.display = "block";
        uploadbtn.disabled = true;
        
            const formData = new FormData();
            formData.append('image', image); // Append the actual file

            const response = fetch('https://api.apyhub.com/processor/image/remove-background/file', {
                method: 'POST',
                headers: {
                    'apy-token': 'APY0rXHrGz87DXR7vqWO6rruqdVlqFVlbseKqRxSOhI88sa5VS5trwghEacZSX4m'
                },
                body: formData
            })
            .then(function(response){
                return response.blob();
            })
            .then(function(blob){
                section2_2.style.display = "none";
                section2_3.style.display = "flex";
                url = URL.createObjectURL(blob);
                genImg.src = url;
            }).catch(err => alert("No response"));
            
    }

    function handleDownload() {
        if (!url) {
            alert("No processed image available to download");
            return;
        }

        const a = document.createElement("a");
        a.href = url;
        a.download = `bg-removed-${new Date().getTime()}.png`;
        document.body.appendChild(a);
        a.click();
    }

    function handleReset() {
        if (url) URL.revokeObjectURL(url);
        loading.style.display = "none";
        fileInput.value = "";
        InputImage.src = "";
        InputImage.style.display = "none";
        placeholder.style.display = "flex";
        genImg.src = "";
        url = null;
        image = null;
        
        section2_3.style.display = "none";
        section2_2.style.display = "flex";
    }
});