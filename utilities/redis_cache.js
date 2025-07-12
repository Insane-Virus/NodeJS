const redis = require('async-redis').createClient();

const redisCache = {
    set : async(keys,value)=> await redis.set(keys,JSON.stringify(value),'EX',process.env.REDIS_LIFE),
    get : async(key) => JSON.parse(await redis.get(key)),
    delete : async(key) => await redis.del(key),
    expire: async(key) => await redis.expire(key,process.env.REDIS_LIFE)
}

module.exports = redisCache;