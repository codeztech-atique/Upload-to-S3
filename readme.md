#Upload Large file to S3
tsc index.ts  
node index.js
node index.js > upload.log 2>&1 &
tail -f upload.log
