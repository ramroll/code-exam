const R = require('ramda')
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
      params
    })
  }


  validate(){

    const groupByName = R.groupBy( rule => rule.name )
    const groups = groupByName(this.rules)
    console.log(groups)


    const errors = Object.keys(groups).map(key => {
      const list = groups[key]
      const requiredRule = list.find(x => x.type === 'required')
      const otherRules = list.filter(x => x.type !== 'required')
      const value = this.query[key]
      if(requiredRule) {
        if(value === undefined) {
          return requiredRule.errorMessage
        }
      }

      for(let i = 0; i < otherRules.length; i++) {
        const rule = otherRules[i]
        if(!requiredRule && value === undefined) {
          return ''
        }
        switch (rule.type) {
          case 'email':
            if( !/^[a-z0-9_-]+@[a-z0-9-]+\.com$/.test(value) ) {
              return rule.errorMessage
            }
            break;
          case 'chinese' :
            if ( /^[\u4e00-\u9fa5]+$/.test(value) ){
              return rule.errorMessage
            }
            break;
          case 'len' :
            const {min, max} = rule.params
            if(min && value.length < min) {
              return rule.errorMessage
            }
            if(max && value.length > max) {
              return rule.errorMessage
            }
            break
          default:
            break;
        }
      }
      return ''
    }).filter(x => x)

    return errors

  }

}




module.exports = Validator