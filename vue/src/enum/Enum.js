class Enum {
  constructor(params) {
    const key_array = [];
    const value_array = [];
    if (!Array.isArray(params)) {
      throw new Error('the parameter must be an array!')
    }
    params.map(item => {
      key_array.push(item.key)
      value_array.push(item.value)
      this[item.key] = item
    })
    this.data = params
    this.key_array = key_array
    this.value_array = value_array
    Object.freeze(this)
  }

  getData() {
    return this.data
  }

  getItemByKey(key) {
    let index = this.key_array.indexOf(key)
    if (index == -1) {
      return '';
    } else {
      return this.data[index];
    }
  }

  getNameByKey(key) {
    let index = this.key_array.indexOf(key)
    if (index == -1) {
      return '';
    }
    let item = this.data[index];
    return item.name || ''
  }

  getNameByValue(value) {
    let index = this.value_array.indexOf(value);
    if (index == -1) {
      return '';
    }
    let item = this.data[index];
    return item.name || ''
  }


}

export default Enum