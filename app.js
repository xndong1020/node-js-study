const fs = require('fs')
const path = require('path')
const { logger } = require('./services/logger')

const pathToFile = path.join(__dirname, 'sample.txt')

// 一套读写逻辑为下：
// 1. 检查文件是否存在
// 2. 如果存在，打开文件，读取内容
// 3. 对内容做简单修改，并保存回去
// 4. 当中如果有错误，则使用logger module来记录
// 3层callback nested, callback hell

console.log('program start')

fs.access(pathToFile, (err, result) => {
  if (!err) {
    fs.readFile(pathToFile, (err, content) => {
      if (err) throw new Error('Read Content Error')
      let modifiedContent = content.toString().replace('hello from', 'go home')
      fs.writeFile(pathToFile, modifiedContent, err => {
        if (err) {
          logger(err)
          return
        }
      })
    })
  } else {
    logger(err)
  }
})

console.log('program ends')
