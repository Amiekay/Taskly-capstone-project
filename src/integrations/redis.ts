const { createClient } = require("redis");

async function initializeRedisClient() {
  // read the Redis connection URL from the envs
  let redisURL = process.env.REDIS_URI;
  if (redisURL) {
    // create the Redis client object
    const redisClient = createClient({ url: redisURL }).on(
      "error",
      (e: any) => {
        console.error(`Failed to create the Redis client with error:`);
        console.error(e);
      }
    );

    try {
      // connect to the Redis server
      await redisClient.connect();
      console.log(`Connected to Redis successfully!`);
    } catch (e) {
      console.error(`Connection to Redis failed with error:`);
      console.error(e);
    }
  }
}
module.exports = initializeRedisClient;
