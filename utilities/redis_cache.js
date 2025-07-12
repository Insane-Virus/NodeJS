// const redis = require('async-redis').createClient({
//     url: "redis://default:AdEAAAIjcDEzMjVkMDE3YTc1ZDc0NTQ5YjA5Y2M2Zjg4ODU2OGJlZHAxMA@maximum-hyena-53504.upstash.io:6379"
// });
const REDIS = require('ioredis');
const redis = new REDIS(process.env.REDIS_URL,{
    tls:{}
});
redis.on("connect",()=>{
    console.log("redis Connected");
})
redis.on("error",(err)=>{
    console.log("redis error ",err);
})

const redisCache = {
    set : async(keys,value)=> await redis.set(keys,JSON.stringify(value),'EX',process.env.REDIS_LIFE),
    get : async(key) => JSON.parse(await redis.get(key)),
    delete : async(key) => await redis.del(key),
    expire: async(key) => await redis.expire(key,process.env.REDIS_LIFE)
}

module.exports = redisCache;