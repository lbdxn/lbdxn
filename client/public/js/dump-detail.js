let imageList = [];

export function enableEdit() {
    const form = document.getElementById('dumpForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.disabled = false);
    document.querySelector('.global-buttons .edit').style.display = 'none';
    document.querySelector('.global-buttons .save').style.display = 'inline-block';
}

export function disableForm() {
    const form = document.getElementById('dumpForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.disabled = true);
}

export function saveDumpData() {
    const form = document.getElementById('dumpForm');
    const formData = new FormData(form);
    const dumpData = Object.fromEntries(formData.entries());

    // 添加必要的验证
    if (!dumpData.dumpName || !dumpData.dumpLocation) {
        alert('渣场名称和位置为必填项');
        return;
    }

    dumpData.images = imageList;

    const dumps = JSON.parse(localStorage.getItem('dumps')) || [];
    const isNewDump = localStorage.getItem('isNewDump') === 'true';

    if (isNewDump) {
        dumpData.dumpId = Date.now().toString();
        dumps.push(dumpData);
    } else {
        const index = dumps.findIndex(d => d.dumpId === dumpData.dumpId);
        if (index !== -1) {
            dumps[index] = dumpData;
        } else {
            dumpData.dumpId = Date.now().toString();
            dumps.push(dumpData);
        }
    }

    localStorage.setItem('dumps', JSON.stringify(dumps));
    alert('渣场数据已保存');
    
    // 保存后跳转到 dump-list.html
    window.location.href = 'dump-list.html';
}

export function loadDumpData(dumpId) {
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

export function updateProgress() {
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

export function uploadFile(fieldName) {
    // 实现文件上传逻辑
}

export function downloadFile(fieldName) {
    // 实现文件下载逻辑
}

export function deleteFile(fieldName) {
    // 实现文件删除逻辑
}

// 保留其他原有的函数...

function updateImageList() {
    // 实现更新图片列表的逻辑
}

// 如果需要，可以在这里添加其他辅助函数