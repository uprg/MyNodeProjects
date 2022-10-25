function hash(key, size){
    let hash = 0

    for (let i=0; i < key.length; i++){
        hash += key.charCodeAt(i)
    }

    return hash % size
}

class HashTable{
    constructor(){
        this.size = 10
        this.buckets = Array(this.size)

        for (let i=0; i < this.buckets.length; i++){
            this.buckets[i] = new Map()
        }
    }

    add(key, data){
        let id = hash(key, this.size)
        this.buckets[id].set(key, data)
    }

    delete(key){
        let id = hash(key, this.size)
        this.buckets[id].delete(key)
    }

    search(key){
        let id = hash(key, this.size)
        return this.buckets[id].get(key)
    }
}


let hashtable = new HashTable()

hashtable.add("1", "all of us are dead")
hashtable.add("2", "squid game")
hashtable.add("3", "#alive")
hashtable.add("4", "train to busan")

console.log(hashtable)