function hash(key, size){
    let hash = 0

    for (let i=0; i < key.length; i++){
        hash += key.charCodeAt(i)
    }

    return hash % size
}

class HashTable{
    constructor(){
        this.bucket = Array(10)
    }

    add(key, data){
        let id = hash(key, 10)
        this.bucket[id] = [key, data]
    }

    delete(key){
        let id = hash(key, 10)
        this.bucket[id] = []
        console.log(this.bucket[id])
    }

    search(key){
        let id = hash(key, 10)
        console.log(this.bucket[id])
    }
}


let hashtable = new HashTable()

hashtable.add("1", "all of us are dead")
hashtable.add("2", "squid game")
hashtable.add("3", "#alive")
hashtable.add("4", "train to busan")

console.log(hashtable)
hashtable.search("1")
hashtable.delete("2")