class ValueNotMatchException{

  constructor(val1, val2, message) {
    this.val1 = val1
    this.val2 = val2
    this.message = message
  }
}

module.exports = ValueNotMatchException