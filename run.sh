DBHOST=localhost \
DB_USER=root \
DB_PASSWD=123456 \
DB_NAME=codeexam \
pm2 start scripts/server/runner.js --watch -- -s account -p 8001