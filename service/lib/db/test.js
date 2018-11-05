var mysql = require("mysql");
var connection = mysql.createConnection({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "123qweasd",
  port: 3306,
  database: "codeexam"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

connection.query("select * from account where id=1", function(
  error,
  results,
  fields
) {
  console.log(results);
  if (error) throw error;
  console.log("The solution is: ", results[0]);
});
