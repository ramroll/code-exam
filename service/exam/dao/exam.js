const Db = require('../../lib/db/db')
const fs = require('fs')
const path = require('path')
class Exam{

  constructor(){

  }

  async load(name){

    const dir = path.resolve(__dirname, '../../../exams', name)
    const files = fs.readdirSync(dir)
    const count = files.filter(x => x.match(/\.md$/)).length

    const questions = []
    for(let i = 1; i <= count; i++) {
      const question = {}
      const md = fs.readFileSync(path.resolve(dir, i + '.md'), 'utf-8')
      const sample = fs.readFileSync(path.resolve(dir, i + '.sample.js'), 'utf-8')
      question.md = md
      question.sample = sample
      questions.push(question)
    }

    return {
      name,
      title : '测试卷1',
      time : 100000,
      questions
    }

  }

}

module.exports = Exam