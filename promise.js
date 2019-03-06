const path = require('path')
const fs = require('fs')

const accessAsync = path => {
  return new Promise((resolve, reject) => {
    fs.access(path, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

const readFileAsync = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (err) reject(err)
      else resolve(content.toString())
    })
  })
}

const writeFileAsync = (path, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

const pathToFile = path.join(__dirname, 'sample.txt')

// 一套读写逻辑为下：
// 1. 检查文件是否存在
// 2. 如果存在，打开文件，读取内容
// 3. 对内容做简单修改，并保存回去
// 4. 当中如果有错误，则使用logger module来记录
// 3层callback nested, callback hell
console.log('starts')
accessAsync(pathToFile)
  .then(() => {
    //console.log(accessAsync(pathToFile)) // Promise { <pending> }
    console.log('accessAsync')
    return readFileAsync(pathToFile)
  })
  .then(data => {
    console.log('readFileAsync')
    const modified = data.toString().replace('go home', 'aaa from')
    return modified
  })
  .then(modified => {
    console.log('writeFileAsync')
    writeFileAsync(pathToFile, modified)
  })
  .catch(err => console.log(err))
console.log('ends')
