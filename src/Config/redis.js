const {createClient}=require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_KEY,
    socket: {
        host: 'redis-16402.c52.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 16402
    } 
});

module.exports=redisClient;


