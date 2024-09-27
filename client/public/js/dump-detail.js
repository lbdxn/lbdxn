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

let imageFiles = [];

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

    // 为渣场名称输入框添加事件监听器
    const dumpNameInput = document.querySelector('input[name="dumpName"]');
    dumpNameInput.addEventListener('change', checkDumpNameExists);

    // 为其他输入框添加事件监听器
    const form = document.getElementById('dumpForm');
    form.addEventListener('input', function(event) {
        if (event.target.name !== 'dumpName' && dumpNameInput.value.trim() !== '') {
            checkDumpNameExists.call(dumpNameInput);
        }
    });

    // 为实际堆渣量和设计堆渣量输入框添加事件监听器
    const actualCapacityInput = document.querySelector('input[name="actualCapacity"]');
    const designedCapacityInput = document.querySelector('input[name="designedCapacity"]');

    actualCapacityInput.addEventListener('input', updateDumpProgress);
    designedCapacityInput.addEventListener('input', updateDumpProgress);

    // 如果是编辑模式，立即更新进度条
    if (dumpId) {
        updateDumpProgress();
    }
});

function checkDumpNameExists() {
    const dumpName = this.value.trim();
    if (dumpName) {
        const dumps = JSON.parse(localStorage.getItem('dumps')) || [];
        const existingDump = dumps.find(d => d.dumpName === dumpName && d.dumpId !== document.querySelector('input[name="dumpId"]')?.value);
        if (existingDump) {
            alert('渣场名称已存在，请重新输入');
            this.value = ''; // 清空输入
            this.focus(); // 重新聚焦到输入框
        }
    }
}

function saveDumpData() {
    // 收集表单数据
    const formData = new FormData(document.getElementById('dumpForm'));
    const dumpData = Object.fromEntries(formData.entries());

    // 检查必填项
    if (!dumpData.dumpName || !dumpData.dumpLocation || !dumpData.dumpStatus) {
        alert('渣场名称、渣场位置和渣场状态为必填项，请填写完整。');
        return;
    }

    // 获取现有的渣场数据
    let dumps = JSON.parse(localStorage.getItem('dumps')) || [];

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    // 添加图片数据
    dumpData.images = imageFiles.map(file => ({
        name: file.name,
        uploadTime: file.uploadTime,
        dataUrl: file.dataUrl,
        type: file.type
    }));

    // 确保所有字段都被包含在dumpData中
    dumpData.coordinates = dumpData.coordinates || '';
    dumpData.dumpLevel = dumpData.dumpLevel || '';
    dumpData.approvedHeight = dumpData.approvedHeight || '';
    dumpData.actualHeight = dumpData.actualHeight || '';
    dumpData.approvedCapacity = dumpData.approvedCapacity || '';
    dumpData.actualCapacity = dumpData.actualCapacity || '';

    if (editId) {
        // 更新现有渣场
        const editIndex = dumps.findIndex(dump => dump.dumpId === editId);
        if (editIndex !== -1) {
            // 保留原有的 dumpId
            dumpData.dumpId = editId;
            dumps[editIndex] = dumpData;
        } else {
            alert('未找到要编辑的渣场数据');
            return;
        }
    } else {
        // 新建渣场
        dumpData.dumpId = Date.now().toString();
        dumps.push(dumpData);
    }

    // 保存更新后的数据
    localStorage.setItem('dumps', JSON.stringify(dumps));

    // 禁用表单字段
    disableForm();

    // 显示保存成功消息
    alert('保存成功');

    // 跳转回列表页面
    window.location.href = 'dump-list.html';
}

function disableForm() {
    const form = document.getElementById('dumpForm');
    const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    inputs.forEach(input => {
        input.disabled = true;
    });
    document.querySelector('.btn-edit').style.display = 'inline-block';
    document.querySelector('.btn-save').style.display = 'none';
}

function editForm() {
    const form = document.getElementById('dumpForm');
    const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    inputs.forEach(input => {
        input.disabled = false;
    });
    document.querySelector('.btn-edit').style.display = 'none';
    document.querySelector('.btn-save').style.display = 'inline-block';
}

function loadDumpData(dumpId) {
    const dumps = JSON.parse(localStorage.getItem('dumps')) || [];
    const dumpData = dumps.find(dump => dump.dumpId === dumpId);

    if (dumpData) {
        Object.keys(dumpData).forEach(key => {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'radio') {
                    const radio = document.querySelector(`[name="${key}"][value="${dumpData[key]}"]`);
                    if (radio) {
                        radio.checked = true;
                    }
                } else {
                    element.value = dumpData[key];
                }
            }
        });
        // 设置隐藏的 dumpId 字段
        const dumpIdField = document.createElement('input');
        dumpIdField.type = 'hidden';
        dumpIdField.name = 'dumpId';
        dumpIdField.value = dumpId;
        document.getElementById('dumpForm').appendChild(dumpIdField);

        // 加载图片数据
        if (dumpData.images && dumpData.images.length > 0) {
            dumpData.images.forEach(image => {
                const row = document.createElement('tr');
                row.setAttribute('data-url', image.dataUrl);
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${image.name}</td>
                    <td>${image.uploadTime}</td>
                    <td class="image-actions">
                        <button onclick="previewImage('${image.dataUrl}', event)">预览</button>
                        <button onclick="downloadImage('${image.name}', '${image.dataUrl}', event)">下载</button>
                    </td>
                    <td>
                        <span onclick="showImageTypeSelect(this)">${image.type}</span>
                    </td>
                `;
                document.getElementById('imageList').appendChild(row);
            });
            updateImageFiles();
    }

        // 更新堆渣进度
        updateDumpProgress();

function openImage() {
        document.getElementById('imageModal').style.display = 'block';
    }
function closeImage() {
        document.getElementById('imageModal').style.display = 'none';
   }
                    
        
function toggleResidentsNearbySection() {
    var dumpType = document.getElementsByName('dumpType')[0].value;
    var residentsNearbySection = document.getElementById('residentsNearbySection');
    if (dumpType === '沟道型') {
    residentsNearbySection.style.display = 'flex';
    } else {
             residentsNearbySection.style.display = 'none';
            }
    }


function updateProgress() {
        var approvedCapacity = parseFloat(document.getElementsByName('approvedCapacity')[0].value) || 0;
        var actualCapacity = parseFloat(document.getElementsByName('actualCapacity')[0].value) || 0;
        
        if (approvedCapacity > 0) {
            var progress = (actualCapacity / approvedCapacity);
            var progressPercentage = Math.min(progress * 100, 100).toFixed(2);
            document.getElementById('dumpProgress').style.width = progressPercentage + '%';
            document.getElementById('dumpProgressText').innerText = progressPercentage + '%';
            
            // 根据进度值设置颜色
            if (progress >= 1) {
                document.getElementById('dumpProgress').style.backgroundColor = 'red';
            } else {
                document.getElementById('dumpProgress').style.backgroundColor = 'green';
            }
        } else {
            document.getElementById('dumpProgress').style.width = '0%';
            document.getElementById('dumpProgressText').innerText = '0%';
            document.getElementById('dumpProgress').style.backgroundColor = 'green';
        }
    }

    
function toggleChangeManagement(show) {
        document.getElementById('changeManagement').style.display = show ? 'block' : 'none';
        if (!show) {
            toggleFollowUpPlan(false);
        }
    }

function toggleFollowUpPlan(show) {
        document.getElementById('followUpPlan').style.display = show ? 'block' : 'none';
    }




function toggleFileUpload(fieldId, show) {
                    const container = document.getElementById(`${fieldId}Upload`);
                    const note = document.getElementById(`${fieldId}Note`);
                    if (container) {
                        container.style.display = show ? 'block' : 'none';
                    }
                    if (note) {
                        note.style.display = show ? 'block' : 'none';
                    }
    }

function previewFile(fileType) {
                    const fileInput = document.getElementById(`${fileType}File`);
                    const file = fileInput.files[0];
                    if (!file) {
                        alert('请先上传文件');
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const content = e.target.result;
                        const modal = document.createElement('div');
                        modal.style.position = 'fixed';
                        modal.style.top = '0';
                        modal.style.left = '0';
                        modal.style.width = '100%';
                        modal.style.height = '100%';
                        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                        modal.style.display = 'flex';
                        modal.style.justifyContent = 'center';
                        modal.style.alignItems = 'center';
                        modal.style.zIndex = '1000';

                        const previewContainer = document.createElement('div');
                        previewContainer.style.backgroundColor = 'white';
                        previewContainer.style.padding = '20px';
                        previewContainer.style.borderRadius = '5px';
                        previewContainer.style.maxWidth = '80%';
                        previewContainer.style.maxHeight = '80%';
                        previewContainer.style.overflow = 'auto';

                        if (file.type === 'application/pdf') {
                            const embed = document.createElement('embed');
                            embed.src = URL.createObjectURL(file);
                            embed.type = 'application/pdf';
                            embed.style.width = '100%';
                            embed.style.height = '600px';
                            previewContainer.appendChild(embed);
                        } else {
                            const pre = document.createElement('pre');
                            pre.textContent = content;
                            previewContainer.appendChild(pre);
                        }

                        const closeButton = document.createElement('button');
                        closeButton.textContent = '关闭';
                        closeButton.style.marginTop = '10px';
                        closeButton.onclick = function() {
                            document.body.removeChild(modal);
                        };

                        previewContainer.appendChild(closeButton);
                        modal.appendChild(previewContainer);
                        document.body.appendChild(modal);
                    };

                    if (file.type === 'application/pdf') {
                        reader.readAsDataURL(file);
                    } else {
                        reader.readAsText(file);
                    }
    }

function downloadFile(fileType) {
                    const fileName = document.getElementById(`${fileType}FileName`).value;
                    const fileInput = document.getElementById(`${fileType}File`);
                    
                    if (fileName && fileInput.files.length > 0) {
                        const file = fileInput.files[0];
                        const url = URL.createObjectURL(file);
                        
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        URL.revokeObjectURL(url);
                    } else {
                        alert('没有可下载的文件');
                    }
    }

function deleteFile(fileType) {
                    document.getElementById(`${fileType}FileName`).value = '';
                    document.getElementById(`${fileType}File`).value = '';
                    alert('文件已删除');
    }

                document.getElementById('designPlanFile').addEventListener('change', function(event) {
                    updateFileName('designPlan', event);
                });

                document.getElementById('stabilityReportFile').addEventListener('change', function(event) {
                    updateFileName('stabilityReport', event);
                });

                document.getElementById('geologicalHazardReportFile').addEventListener('change', function(event) {
                    updateFileName('geologicalHazardReport', event);
                });

                function updateFileName(fileType, event) {
                    const file = event.target.files[0];
                    if (file) {
                        document.getElementById(`${fileType}FileName`).value = file.name;
                    }
    }
        

    // 页面加载时初始化进度条
    document.addEventListener('DOMContentLoaded', function() {
        updateProgress();
    });

            
    }
}
