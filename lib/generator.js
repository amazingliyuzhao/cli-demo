// // npm i handlebars metalsmith -D
// const Metalsmith = require('metalsmith')
// const Handlebars = require('handlebars')
const rm = require('rimraf').sync //以包的形式包装rm -rf命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除


// module.exports = function (metadata = {}, src, dest = '.') {
//   if (!src) {
//     return Promise.reject(new Error(`无效的source：${src}`))
//   }

//   return new Promise((resolve, reject) => {
//     Metalsmith(process.cwd())
//       .metadata(metadata)
//       .clean(false)
//       .source(src)
//       .destination(dest)
//       .use((files, metalsmith, done) => {
//       	const meta = metalsmith.metadata()
//         Object.keys(files).forEach(fileName => {
//           const t = files[fileName].contents.toString()
//           files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
//         })
//       	done()
//       }).build(err => {
//       	rm(src)
//       	err ? reject(err) : resolve()
//       })
//   })
// }

const Metalsmith = require('metalsmith') // 插值
const Handlebars = require('handlebars') // 模版
const remove = require("../lib/remove") // 删除
const fs = require("fs")
const path = require("path")
/**
 * 生成文件
 * @param 文件的名称
 */
module.exports = function (context) {

  let metadata = context.metadata; // 用户自定义信息
  let src = context.downloadTemp; // 暂时存放文件目录
  let dest = './' + context.projectRoot; //项目的根目录

  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }
  // return new Promise((resolve, reject) => {
  //       Metalsmith(process.cwd())
  //         .metadata(metadata)
  //         .clean(false)
  //         .source(src)
  //         .destination(dest)
  //         .use((files, metalsmith, done) => {
  //         	const meta = metalsmith.metadata()
  //           Object.keys(files).forEach(fileName => {
  //             const t = files[fileName].contents.toString()
  //             files[fileName].contents = new Buffer.from(Handlebars.compile(t)(meta))
  //           })
  //         	done()
  //         }).build(err => {
  //         	rm(src)
  //         	err ? reject(err) : resolve()
  //         })
  //     })

  return new Promise((resolve, reject) => {
    const metalsmith = Metalsmith(process.cwd())
      .metadata(metadata) // 将用户输入信息放入
      .clean(false)
      .source(src)
      .destination(dest);
    // 判断下载的项目模板中是否有templates.ignore
    // const ignoreFile = path.resolve(process.cwd(), path.join(src, 'templates.ignore'));

    // if (fs.existsSync(ignoreFile)) {
    //   // 定义一个用于移除模板中被忽略文件的metalsmith插件
    //   metalsmith.use((files, metalsmith, done) => {
    //     const meta = metalsmith.metadata()
    //     // 先对ignore文件进行渲染，然后按行切割ignore文件的内容，拿到被忽略清单
    //     const ignores = Handlebars
    //       .compile(fs.readFileSync(ignoreFile).toString())(meta)
    //       .split('\n').map(s=>s.trim().replace(/\//g,"\\")).filter(item => item.length);
    //     //删除被忽略的文件
    //     for (let ignorePattern of ignores) {
    //       if (files.hasOwnProperty(ignorePattern)) {
    //         delete files[ignorePattern];
    //       }
    //     }
    //     done()
    //   })
    // }

    metalsmith.use((files, metalsmith, done) => {
      const meta = metalsmith.metadata()
      Object.keys(files).forEach(fileName => {
        // console.log(fileName.split(".").pop() !== "png" || fileName.split(".").pop() !== "jpg")
        // console.log(fileName.split(".").pop() != "png")
        if(fileName.split(".").pop() != "png"){
          const t = files[fileName].contents.toString()
          files[fileName].contents = new Buffer.from(Handlebars.compile(t)(meta),'UTF-8')
        }
      })
      done()
    }).build(err => {
      remove(src);
      err ? reject(err) : resolve(context);
    })
  })
}
