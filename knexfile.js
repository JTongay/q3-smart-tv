// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'smart-tv',
      host: 'localhost'
    },
    migrations: {
      directory: __dirname + "/db"
    },
    seeds: {
      directory: __dirname + "/db"
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
