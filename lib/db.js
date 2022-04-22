var Knex = require('knex');
 
var db = Knex({
    client: "mysql",
    connection: {
        host: process.env.MYSQL_HOST,
        port: 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    },
    migrations: {
        tableName: 'migrations'
    }
});

db.migrate.latest()
  .then(function() {
    //return db.seed.run();
  });

module.exports = db;