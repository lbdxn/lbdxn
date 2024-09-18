let imageList = [];

function openFileDialog() {
    document.getElementById('fileInput').click();
}

function uploadImage(files) {
    for (let file of files) {
        const uploadTime = new Date().toLocaleString();
        imageList.push({ name: file.name, time: uploadTime });
    }
    updateImageList();
}

function downloadImage() {
    // 实现图片下载逻辑
    alert('下载功能待实现');
}

function browseImage() {
    // 实现图片浏览逻辑
    alert('浏览功能待实现');
}

function deleteImage() {
    // 实现图片删除逻辑
    if (imageList.length > 0) {
        imageList.pop();
        updateImageList();
    } else {
        alert('没有可删除的图片');
    }
}

function updateImageList() {
    const tbody = document.getElementById('imageListBody');
    tbody.innerHTML = '';
    imageList.forEach(image => {
        const row = tbody.insertRow();
        const nameCell = row.insertCell(0);
        const timeCell = row.insertCell(1);
        nameCell.textContent = image.name;
        timeCell.textContent = image.time;
    });
}

// 其他表单处理逻辑
document.getElementById('dumpForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // 处理表单提交逻辑
    console.log('表单提交');
});