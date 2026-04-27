// 初始化维格表 SDK
const vika = new Vika({ token: "uskNUrvWvJoD3VuQ5zW7GYH", fieldKey: "name" });
const datasheet = vika.datasheet("dsttAVvPjCN9mjd1lg");

// 页面加载完成后初始化
 document.addEventListener('DOMContentLoaded', () => {
  // 加载所有记录
  loadRecords();
  
  // 新增回答表单提交
  const addForm = document.getElementById('add-form');
  addForm.addEventListener('submit', handleAddSubmit);
  
  // 修改回答表单提交
  const editForm = document.getElementById('edit-form');
  editForm.addEventListener('submit', handleEditSubmit);
  
  // 取消修改
  const cancelEditBtn = document.getElementById('cancel-edit');
  cancelEditBtn.addEventListener('click', cancelEdit);
});

// 加载所有记录
async function loadRecords() {
  try {
    const response = await datasheet.records.query({ viewId: "viw64SwhLAftl" });
    if (response.success) {
      renderRecords(response.data.records);
    } else {
      console.error('加载记录失败:', response);
      showMessage('add-message', '加载记录失败', 'error');
    }
  } catch (error) {
    console.error('加载记录时出错:', error);
    showMessage('add-message', '加载记录失败', 'error');
  }
}

// 渲染记录到表格
function renderRecords(records) {
  const tableBody = document.querySelector('#records-table tbody');
  tableBody.innerHTML = '';
  
  if (records && records.length > 0) {
    records.forEach(record => {
      const row = document.createElement('tr');
      
      const userCell = document.createElement('td');
      userCell.textContent = record.fields.user || 'N/A';
      row.appendChild(userCell);
      
      const answerCell = document.createElement('td');
      answerCell.textContent = record.fields.answer || 'N/A';
      row.appendChild(answerCell);
      
      const actionCell = document.createElement('td');
      actionCell.className = 'actions';
      
      // 编辑按钮
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.textContent = '编辑';
      editBtn.addEventListener('click', () => editRecord(record));
      actionCell.appendChild(editBtn);
      
      // 删除按钮
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '删除';
      deleteBtn.addEventListener('click', () => deleteRecord(record.recordId));
      actionCell.appendChild(deleteBtn);
      
      row.appendChild(actionCell);
      tableBody.appendChild(row);
    });
  } else {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.textContent = '暂无投票记录。';
    cell.style.textAlign = 'center';
    row.appendChild(cell);
    tableBody.appendChild(row);
  }
}

// 处理新增回答提交
async function handleAddSubmit(event) {
  event.preventDefault();
  
  const user = document.getElementById('user').value;
  const answer = document.getElementById('answer').value;
  
  try {
    const response = await datasheet.records.create({
      records: [
        {
          fields: {
            user: user,
            answer: answer
          }
        }
      ]
    });
    
    if (response.success) {
      showMessage('add-message', '新增回答成功！', 'success');
      document.getElementById('add-form').reset();
      loadRecords(); // 重新加载记录
    } else {
      console.error('新增回答失败:', response);
      showMessage('add-message', '新增回答失败', 'error');
    }
  } catch (error) {
    console.error('新增回答时出错:', error);
    showMessage('add-message', '新增回答失败', 'error');
  }
}

// 编辑记录
function editRecord(record) {
  document.getElementById('edit-record-id').value = record.recordId;
  document.getElementById('edit-user').value = record.fields.user || '';
  document.getElementById('edit-answer').value = record.fields.answer || '';
  document.getElementById('edit-section').style.display = 'block';
}

// 处理修改回答提交
async function handleEditSubmit(event) {
  event.preventDefault();
  
  const recordId = document.getElementById('edit-record-id').value;
  const user = document.getElementById('edit-user').value;
  const answer = document.getElementById('edit-answer').value;
  
  try {
    const response = await datasheet.records.update({
      records: [
        {
          recordId: recordId,
          fields: {
            user: user,
            answer: answer
          }
        }
      ]
    });
    
    if (response.success) {
      showMessage('edit-message', '修改回答成功！', 'success');
      cancelEdit();
      loadRecords(); // 重新加载记录
    } else {
      console.error('修改回答失败:', response);
      showMessage('edit-message', '修改回答失败', 'error');
    }
  } catch (error) {
    console.error('修改回答时出错:', error);
    showMessage('edit-message', '修改回答失败', 'error');
  }
}

// 取消编辑
function cancelEdit() {
  document.getElementById('edit-section').style.display = 'none';
  document.getElementById('edit-form').reset();
  document.getElementById('edit-message').textContent = '';
  document.getElementById('edit-message').className = '';
}

// 删除记录
async function deleteRecord(recordId) {
  if (confirm('确定要删除这条记录吗？')) {
    try {
      const response = await datasheet.records.delete({
        recordIds: [recordId]
      });
      
      if (response.success) {
        showMessage('add-message', '删除回答成功！', 'success');
        loadRecords(); // 重新加载记录
      } else {
        console.error('删除回答失败:', response);
        showMessage('add-message', '删除回答失败', 'error');
      }
    } catch (error) {
      console.error('删除回答时出错:', error);
      showMessage('add-message', '删除回答失败', 'error');
    }
  }
}

// 显示消息
function showMessage(elementId, message, type) {
  const messageElement = document.getElementById(elementId);
  messageElement.textContent = message;
  messageElement.className = type;
  
  // 3秒后清除消息
  setTimeout(() => {
    messageElement.textContent = '';
    messageElement.className = '';
  }, 3000);
}