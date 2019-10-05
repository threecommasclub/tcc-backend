import { createConnection } from 'typeorm';

export const testConn = (drop = false) => {
  return createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    database: 'tcc_test',
    username: 'tcc_test',
    password: 'tcc_password',
    synchronize: drop,
    dropSchema: drop,
    logging: true,
    entities: [__dirname + '/../entities/*.*'],
  });
};
