const R = require('ramda')
const LogicException = require('../exception/LogicException')
class Validator{

  constructor(query){
    this.errors = []
    this.rules = []
    this.query = query
  }

  check(name, type, errorMessage, params) {
    this.rules.push({
      name,
      type,
      errorMessage,
      params : params || {}
    })
  }


  validate(){

    const groupByName = R.groupBy( rule => rule.name )
    const groups = groupByName(this.rules)
    // console.log(groups)


    const errors = Object.keys(groups).map(key => {
      const list = groups[key]
      const requiredRule = list.find(x => x.type === 'required')
      const otherRules = list.filter(x => x.type !== 'required')
      const value = this.query[key]
      if(requiredRule) {
        if(value === undefined) {
          throw new LogicException(requiredRule.errorMessage)
        }
      }

      for(let i = 0; i < otherRules.length; i++) {
        const rule = otherRules[i]
        if(!requiredRule && value === undefined) {
          return ''
        }

        /* 验证正则表达式 */
        if(rule.type instanceof RegExp) {
          if(!rule.type.test(value)) {
            throw new LogicException(rule.errorMessage)
          }
        }

        /* 验证其他规则 */
        switch (rule.type) {
        case 'email':
          if( !/^[a-z0-9_-]+@[a-z0-9-]+\.com$/.test(value) ) {
            throw new LogicException(rule.errorMessage)
          }
          break
        case 'chinese' :
          if ( /^[\u4e00-\u9fa5]+$/.test(value) ){
            throw new LogicException(rule.errorMessage)
          }
          break
        case 'len' : {
          const {min, max} = rule.params
          if(min && value.length < min) {
            throw new LogicException(rule.errorMessage)
          }
          if(max && value.length > max) {
            throw new LogicException(rule.errorMessage)
          }
          break
        }
        case 'integer' : {

          const {min, max} = rule.params
          if( !(value + '').match(/^\d+$/) ) {
            throw new LogicException(rule.errorMessage)
          }
          if(min && value < min) {
            throw new LogicException(rule.errorMessage)
          }
          if(max && value > max) {
            throw new LogicException(rule.errorMessage)
          }
          break
        }
        default:
          break
        }
      }
      return ''
    })


  }

}




module.exports = Validator