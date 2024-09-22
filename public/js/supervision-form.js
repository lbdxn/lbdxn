document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const supervisionId = urlParams.get('id');
    const isNewSupervision = !supervisionId;

    localStorage.setItem('isNewSupervision', isNewSupervision);

    if (!isNewSupervision) {
        loadSupervisionData(supervisionId);
        disableForm();
    } else {
        document.querySelector('.global-buttons .edit').style.display = 'none';
        document.querySelector('.global-buttons .save').style.display = 'inline-block';
    }
});

// 加载监督数据
function loadSupervisionData(supervisionId) {
    const supervisions = JSON.parse(localStorage.getItem('supervisions')) || [];
    const supervision = supervisions.find(s => s.id === supervisionId);
    if (supervision) {
        Object.keys(supervision).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = supervision[key];
            }
        });
    }
}

// 启用表单编辑
export function enableEdit() {
    const form = document.getElementById('supervisionForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => input.disabled = false);
    
    document.querySelector('.global-buttons .edit').style.display = 'none';
    document.querySelector('.global-buttons .save').style.display = 'inline-block';
}

// 禁用表单编辑
export function disableForm() {
    const form = document.getElementById('supervisionForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => input.disabled = true);
    
    document.querySelector('.global-buttons .edit').style.display = 'inline-block';
    document.querySelector('.global-buttons .save').style.display = 'none';
}

// 保存监督数据
export function saveSupervisionData() {
    const form = document.getElementById('supervisionForm');
    const formData = new FormData(form);
    const supervisionData = Object.fromEntries(formData.entries());

    const isNewSupervision = localStorage.getItem('isNewSupervision') === 'true';
    let supervisions = JSON.parse(localStorage.getItem('supervisions')) || [];

    if (isNewSupervision) {
        supervisionData.id = Date.now().toString(); // 确保每个新记录都有唯一的ID
        supervisions.push(supervisionData);
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const supervisionId = urlParams.get('id');
        supervisionData.id = supervisionId; // 确保更新时保留原有的ID
        const index = supervisions.findIndex(s => s.id === supervisionId);
        if (index !== -1) {
            supervisions[index] = supervisionData;
        } else {
            console.error('未找到要更新的监督记录');
            return;
        }
    }

    localStorage.setItem('supervisions', JSON.stringify(supervisions));
    
    alert(isNewSupervision ? '监督记录已成功创建' : '监督记录已成功更新');
    disableForm();
    
    // 如果是新建的监督记录,可以选择重定向到列表页面
    if (isNewSupervision) {
        window.location.href = 'supervision-list.html';
    }
}

// 文件上传函数 (如果需要的话)
export function uploadFile(fieldName) {
    // 实现文件上传逻辑
    console.log(`Uploading file for ${fieldName}`);
}

// 文件下载函数 (如果需要的话)
export function downloadFile(fieldName) {
    // 实现文件下载逻辑
    console.log(`Downloading file for ${fieldName}`);
}

// 文件删除函数 (如果需要的话)
export function deleteFile(fieldName) {
    // 实现文件删除逻辑
    console.log(`Deleting file for ${fieldName}`);
}