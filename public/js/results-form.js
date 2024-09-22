document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resultForm');
    const messageElement = document.getElementById('message');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveResult();
    });

    function saveResult() {
        const resultData = {
            projectId: document.getElementById('projectId').value,
            date: document.getElementById('date').value,
            details: document.getElementById('details').value,
            // 添加其他相关字段
        };

        // 这里应该发送到后端API，暂时使用localStorage模拟
        let results = JSON.parse(localStorage.getItem('results')) || [];
        resultData.id = Date.now().toString(); // 简单的ID生成方式
        results.push(resultData);
        localStorage.setItem('results', JSON.stringify(results));

        messageElement.textContent = '结果保存成功';
        form.reset();
    }

    // 如果是编辑模式，加载现有数据
    const urlParams = new URLSearchParams(window.location.search);
    const resultId = urlParams.get('id');
    if (resultId) {
        loadResult(resultId);
    }

    function loadResult(id) {
        const results = JSON.parse(localStorage.getItem('results')) || [];
        const result = results.find(r => r.id === id);
        if (result) {
            document.getElementById('projectId').value = result.projectId;
            document.getElementById('date').value = result.date;
            document.getElementById('details').value = result.details;
            // 设置其他字段
        }
    }
});