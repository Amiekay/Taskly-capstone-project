const redis = require('redis')


const client = redis.createClient(
{
    host: 'localhost',
    port: 6379
}
)
.on('connect',()=>{
    console.log('Redis connected')
})


module.exports = client