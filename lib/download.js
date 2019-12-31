const download = require('download-git-repo')
const path = require("path")
const ora = require('ora')

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp');
  return new Promise(function (res, rej) {
    // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
    // 格式是名字/地址 后面不加 .git 但是带着 #分支
    // let url='github:ZoeLeee/BaseLearnCli#bash';
    // let url='https://github.com:username/templates-repo.git#master'
    // let url='https://github.com/whatwg/html.git#master'
    // https://github.com/ZoeLeee/BaseLearnCli.git
    // let url = 'amazingliyuzhao/CliTestGit#test'
    let url = 'amazingliyuzhao/cli-template#master'
    const spinner = ora(`正在下载项目模板，源地址：${url}`)
    spinner.start();

    download(url, target, { clone: false }, function (err) { // clone false 设置成false 具体设置看官网设置
      if (err) {
        spinner.fail()
        rej(err)
      }
      else {
        // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
        spinner.succeed()
        res(target)
      }
    })
  })
}