const { promisify } = require('util')
const path = require('path')
const fs = require('fs')

// 准备promise version的读写文件
const readAsync = promisify(fs.readFile)
const accessAsync = promisify(fs.access)
const writeAsync = promisify(fs.writeFile)

const pathToFile = path.join(__dirname, 'sample.txt')
const pathToFileWrong = path.join(__dirname, 'sample1111.txt')

// 一套读写逻辑为下：
// 1. 检查文件是否存在
// 2. 如果存在，打开文件，读取内容
// 3. 对内容做简单修改，并保存回去
// 4. 当中如果有错误，则使用logger module来记录
// 3层callback nested, callback hell
accessAsync(pathToFile)
  .then(() => {
    //console.log(accessAsync(pathToFile)) // Promise { <pending> }
    return readAsync(pathToFile)
  })
  .then(data => {
    const modified = data.toString().replace('go home', 'hell from')
    return modified
  })
  .then(modified => {
    writeAsync(pathToFile, modified)
  })
  .catch(err => console.log(err))
