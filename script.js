// 初始化维格表 SDK
const vika = new Vika({ token: "uskNUrvWvJoD3VuQ5zW7GYH", fieldKey: "name" });
const datasheet = vika.datasheet("dsttAVvPjCN9mjd1lg");

// 页面加载完成后初始化
 document.addEventListener('DOMContentLoaded', () => {
  // 加载所有记录
  loadRecords();
});

// 加载所有记录
async function loadRecords() {
  try {
    const response = await datasheet.records.query({ viewId: "viw64SwhLAftl" });
    if (response.success) {
      renderRecords(response.data.records);
    } else {
      console.error('加载记录失败:', response);
      showErrorMessage('加载记录失败');
    }
  } catch (error) {
    console.error('加载记录时出错:', error);
    showErrorMessage('加载记录失败');
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
      
      tableBody.appendChild(row);
    });
  } else {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 2;
    cell.textContent = '暂无投票记录。';
    cell.style.textAlign = 'center';
    row.appendChild(cell);
    tableBody.appendChild(row);
  }
}

// 显示错误消息
function showErrorMessage(message) {
  const tableBody = document.querySelector('#records-table tbody');
  tableBody.innerHTML = '';
  
  const row = document.createElement('tr');
  const cell = document.createElement('td');
  cell.colSpan = 2;
  cell.textContent = message;
  cell.style.textAlign = 'center';
  cell.style.color = 'red';
  row.appendChild(cell);
  tableBody.appendChild(row);
}