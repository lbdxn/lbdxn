const crypto = require('crypto');

   // 生成一个随机的 32 字节字符串，并将其转换为十六进制格式
   const secretKey = crypto.randomBytes(32).toString('hex');

   // 输出生成的 SECRET_KEY
   console.log(`Your generated SECRET_KEY is: ${secretKey}`);