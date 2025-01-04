const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");

let filesToUpload = [];

// Preview files
fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    previewContainer.innerHTML = "";
    filesToUpload = [];

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        const previewItem = document.createElement("div");
        previewItem.className = "preview-item";

        reader.onload = (e) => {
            if (file.type.startsWith("image")) {
                const img = document.createElement("img");
                img.src = e.target.result;
                previewItem.appendChild(img);
            } else if (file.type.startsWith("video")) {
                const video = document.createElement("video");
                video.src = e.target.result;
                video.controls = true;
                previewItem.appendChild(video);
            }

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                filesToUpload.splice(index, 1);
                previewItem.remove();
            });

            previewItem.appendChild(deleteBtn);
            previewContainer.appendChild(previewItem);
        };

        reader.readAsDataURL(file);
        filesToUpload.push(file);
    });
});

// Upload files
uploadBtn.addEventListener("click", async () => {
    const formData = new FormData();
    filesToUpload.forEach((file) => formData.append("file", file));

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        alert("Files uploaded successfully!");
        console.log(result);
    } catch (error) {
        console.error("Error uploading files:", error);
    }
});