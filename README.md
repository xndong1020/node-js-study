## Study JavaScript callback, promise and async-await

### `callback`

```js
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
```

### `promise (using promisify)`

```js
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
```

### `promise (using hand-wrote Promise syntax)`

```js
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
```

### `async-await`

```js
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
const updateFile = async path => {
  try {
    console.log('program starts')
    await accessAsync(path)
    console.log('after accessAsync')
    const content = await readFileAsync(path)
    console.log('after readFileAsync')
    const modified = content.toString().replace('aaa from', 'go from')
    await writeFileAsync(path, modified)
    console.log('after writeFileAsync')
    console.log('ends')
  } catch (err) {
    err => console.log(err)
  }
}

updateFile(pathToFile)
```
