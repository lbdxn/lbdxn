let imageList = [];
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const dumpId = urlParams.get('id');
    if (dumpId) {
        loadDumpData(dumpId);
        disableForm();
        document.querySelector('.btn-edit').style.display = 'inline-block';
        document.querySelector('.btn-save').style.display = 'none';
    } else {
        document.querySelector('.btn-edit').style.display = 'none';
        document.querySelector('.btn-save').style.display = 'inline-block';
    }
});

function loadDumpData(dumpId) {
    const dumps = JSON.parse(localStorage.getItem('dumps')) || [];
    const dump = dumps.find(d => d.dumpId === dumpId);
    if (dump) {
        Object.keys(dump).forEach(key => {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'radio') {
                    const radio = document.querySelector(`[name="${key}"][value="${dump[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    element.value = dump[key];
                }
            }
        });
        // 加载图片列表
        imageList = dump.images || [];
        updateImageList();
        updateProgress();
    }
}

function saveDumpData() {
    if (!isEditMode) {
        alert('请先点击"修改"按钮进入编辑模式');
        return;
    }

    const form = document.getElementById('dumpForm');
    const formData = new FormData(form);
    const dumpData = Object.fromEntries(formData.entries());

    // 添加必要的验证
    if (!dumpData.dumpName || !dumpData.dumpLocation) {
        alert('渣场名称和位置为必填项');
        return;
    }

    dumpData.images = imageList;

    let dumps = JSON.parse(localStorage.getItem('dumps')) || [];
    const index = dumps.findIndex(d => d.dumpId === dumpData.dumpId);
    if (index !== -1) {
        dumps[index] = dumpData;
    } else {
        dumpData.dumpId = Date.now().toString();
        dumps.push(dumpData);
    }
    localStorage.setItem('dumps', JSON.stringify(dumps));

    alert('保存成功');
    disableForm();
    isEditMode = false;
    document.querySelector('.btn-edit').style.display = 'inline-block';
    document.querySelector('.btn-save').style.display = 'none';
}

function editForm() {
    enableForm();
    isEditMode = true;
    document.querySelector('.btn-edit').style.display = 'none';
    document.querySelector('.btn-save').style.display = 'inline-block';
}

function disableForm() {
    const form = document.getElementById('dumpForm');
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = true;
    }
}

function enableForm() {
    const form = document.getElementById('dumpForm');
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
    }
}

function updateImageList() {
    const tbody = document.getElementById('imageListBody');
    tbody.innerHTML = '';
    imageList.forEach((image, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" name="imageSelect" value="${index}"></td>
            <td>${image.name}</td>
            <td>${image.time}</td>
            <td>
                <button onclick="previewImage(${index})">预览</button>
                <button onclick="downloadImage(${index})">下载</button>
            </td>
            <td>
                <select onchange="updateImageType(${index}, this.value)">
                    <option value="">请选择</option>
                    <option value="航拍全景" ${image.type === '航拍全景' ? 'selected' : ''}>航拍全景</option>
                    <option value="渣场局部" ${image.type === '渣场局部' ? 'selected' : ''}>渣场局部</option>
                    <option value="其他" ${image.type === '其他' ? 'selected' : ''}>其他</option>
                </select>
            </td>
        `;
    });
}

function uploadImage(files) {
    if (!isEditMode) {
        alert('请先点击"修改"按钮进入编辑模式');
        return;
    }
    for (let file of files) {
        const uploadTime = new Date().toLocaleString();
        imageList.push({ name: file.name, time: uploadTime, type: '' });
    }
    updateImageList();
}

function deleteSelectedImages() {
    if (!isEditMode) {
        alert('请先点击"修改"按钮进入编辑模式');
        return;
    }
    const selectedImages = document.querySelectorAll('input[name="imageSelect"]:checked');
    const indicesToRemove = Array.from(selectedImages).map(checkbox => parseInt(checkbox.value)).sort((a, b) => b - a);
    indicesToRemove.forEach(index => {
        imageList.splice(index, 1);
    });
    updateImageList();
}

function previewImage(index) {
    // 实现图片预览逻辑
    alert(`预览图片: ${imageList[index].name}`);
}

function downloadImage(index) {
    // 实现图片下载逻辑
    alert(`下载图片: ${imageList[index].name}`);
}

function updateImageType(index, type) {
    imageList[index].type = type;
}

function updateProgress() {
    const approvedCapacity = parseFloat(document.querySelector('[name="approvedCapacity"]').value) || 0;
    const actualCapacity = parseFloat(document.querySelector('[name="actualCapacity"]').value) || 0;
    
    if (approvedCapacity > 0) {
        const progress = (actualCapacity / approvedCapacity);
        const progressPercentage = Math.min(progress * 100, 100).toFixed(2);
        document.getElementById('dumpProgress').style.width = progressPercentage + '%';
        document.getElementById('dumpProgressText').innerText = progressPercentage + '%';
        
        document.getElementById('dumpProgress').style.backgroundColor = progress >= 1 ? 'red' : 'green';
    } else {
        document.getElementById('dumpProgress').style.width = '0%';
        document.getElementById('dumpProgressText').innerText = '0%';
        document.getElementById('dumpProgress').style.backgroundColor = 'green';
    }
}

// 添加事件监听器
document.querySelector('.btn-save').addEventListener('click', saveDumpData);
document.querySelector('.btn-edit').addEventListener('click', editForm);
document.getElementById('imageUpload').addEventListener('change', function(event) {
    uploadImage(event.target.files);
});
document.querySelector('[name="approvedCapacity"]').addEventListener('input', updateProgress);
document.querySelector('[name="actualCapacity"]').addEventListener('input', updateProgress);