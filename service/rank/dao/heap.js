function swap(A, i, j) {
  const t = A[i]
  A[i] = A[j]
  A[j] = t
}
class MaxHeap{
  constructor(setter, getter, clone = false) {
    if (!clone) {
      this.list = [] 
      this.heapSize = this.list.length
      this.setter = setter
      this.getter = getter
      this.build()

    }
  }

  clone(){
    const heap = new MaxHeap()
    heap.list = [...this.list]
    heap.heapSize = this.heapSize 
    heap.setter = this.setter
    heap.getter = this.getter
    return heap
  }

  build(){
    let i = Math.floor(this.heapSize/2) - 1
    while(i >= 0) {
      this.max_heapify(i--)
    }
  }

  extract() {
    if (this.heapSize === 0) return null
    const item = this.list[0]
    swap(this.list, 0, this.heapSize - 1)
    this.heapSize--
    this.max_heapify(0)
    return item
  }

  add(item){
    const key = this.getter(item)
    this.list[this.heapSize++] = item
    this.setter(item, -Infinity)
    this.increase(this.heapSize -1, key)
  }

  increase(i, key) {
    let p = ~~Math.floor(i/2)  
    let q = i 
    this.setter(this.list[i], key)
    while(this.getter(this.list[p]) < this.getter(this.list[q])) {
      swap(this.list, p, q)
      q = p
      p = ~~Math.floor(p / 2)
    }
  }

  getSorted(k){
    const clone = this.clone()
    const list = []
    while(clone.heapSize && k--) {
      list.push(clone.extract())
    }
    return list

  }

  max_heapify(i) {
    const leftIndex = 2*i + 1
    const rightIndex = 2*i + 2
    let maxIndex = i
    if (leftIndex < this.heapSize &&
      this.getter(this.list[leftIndex]) > this.getter(this.list[maxIndex])
    ) {
      maxIndex = leftIndex
    }
    if(rightIndex < this.heapSize && 
      this.getter( this.list[rightIndex] ) 
        > this.getter(this.list[maxIndex])) {
      maxIndex = rightIndex
    }
    if(i !== maxIndex) {
      swap(this.list, maxIndex, i)
      this.max_heapify(maxIndex)
    }
  }
}


// const maxHeap = new MaxHeap(
//   (a, key) => a.score = key,
//   a => a.score
// )
// const list = [{
//   score : 100
// }, {
//   score : 103,
// }, {
//   score : 77,
// }, {
//   score : 33
// }, {
//   score : 200
// }]

// list.forEach(item => maxHeap.add(item))

// console.log(maxHeap.getSorted(3))


module.exports = MaxHeap
