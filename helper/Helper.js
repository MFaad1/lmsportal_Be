const url  = 'mongodb+srv://faad123:wIsElNCgYEfePMAi@cluster0.n0ad2oh.mongodb.net/myDatabase?retryWrites=true&w=majority'
const mognoose = require('mongoose')

mognoose.set("strictQuery", true)

const connect =()=>{
    mognoose.connect(url)
    .then(()=>console.log('database connected'))
    .catch((err)=>console.log(err.message, 'error occured while connecting to mongodb'))
}

module.exports = connect