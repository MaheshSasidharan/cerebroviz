var config = {
    development: {
        poolConfig: {
            connectionLimit: 100, //important
            host: 'localhost',
            user: 'sasidharan',
            password: 'pass@123',
            database: 'Screener',
            debug: false
        }
    },
    production: {
        //url to be used in link generation
        url: 'http://my.site.com',
        //mongodb connection settings
        database: {
            host: '127.0.0.1',
            port: '27017',
            db: 'site'
        },
        //server details
        server: {
            host: '127.0.0.1',
            port: '3421'
        },
        poolConfig: {
            connectionLimit: 100, //important
            host: 'sulnwdk5uwjw1r2k.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'sydanwqs6bhn2iv7',
            password: 'fj9irwmpj27c24v7',
            database: 'dxkoryb945r9j98x',
            debug: false
        }
    }
};
module.exports = config;