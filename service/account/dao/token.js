class Token {
  validate() {
    if (this.inst) {
      const expire_time = this.inst.get('expire_time')

      if (expire_time && expire_time.getTime() > new Date().getTime()) {
        return true
      }
    }
    return false
  }

  async create_token() {
    const token = md5(new Date().getTime() + Math.random())
    this.inst = await db.Token.create({
      token: token,
      expire_time: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000)
    })
    return this
  }

}