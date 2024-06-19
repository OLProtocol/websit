/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

function updateVersion() {
  const filePath = path.join(__dirname, 'public', 'version.txt');
  const assetFilePath = path.join(__dirname, 'src/assets', 'version.txt');
  
  // 读取version.txt文件中的数字
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取文件失败:', err);
      return;
    }
    
    // 将读取到的数字加1
    const version = parseInt(data || 0) + 1;
    
    // 将加1后的数字覆盖写入version.txt文件中
    fs.writeFile(filePath, version.toString(), 'utf8', (err) => {
      if (err) {
        console.error('写入文件失败:', err);
        return;
      }
      
      console.log('版本号已更新:', version);
    });
    fs.writeFile(assetFilePath, version.toString(), 'utf8', (err) => {
      if (err) {
        console.error('写入文件失败:', err);
        return;
      }
      
    });
  });
}

updateVersion();
