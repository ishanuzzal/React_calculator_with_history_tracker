console.log("hello worlds")

let meeting = new Promise(function(resolve,reject){
        resolve("hello world")
})

async function myfunc(){
    const set = await meeting
    console.log(set)
}

myfunc()
console.log("hello")