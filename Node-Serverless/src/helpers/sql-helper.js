const Mysql = require('node-mysql-helper');

const mysqlOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  socketPath: false,
  connectionLimit: 5,
  acquireTimeout: 20000,
};

Mysql.connect(mysqlOptions);

exports.query = (sql, params, limit = 0) => {
  if (sql.includes(':')) {
    sql = sql.replace(/\:(\w+)/g, function (txt, key) {
      if (params.hasOwnProperty(key)) {
        return Mysql.escape(params[key]);
      }
      return txt;
    });
  }

  return Mysql.query(sql, params)
    .then((rows) => {
      if (limit === 1) {
        return rows.length > 0 ? rows[0] : null;
      } else {
        return rows;
      }
    })
    .catch((error) => {
      return null;
    });
};
