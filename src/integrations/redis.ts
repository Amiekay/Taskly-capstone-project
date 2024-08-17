const redis = require('redis')


const client = redis.createClient(
{
    port: 6379, // Redis port
    host: "127.0.0.1", 
}
)
.on('connect',()=>{
    console.log('Redis connected')
})


module.exports = client