// Code that is used to seed the database.

import { createConnection } from 'typeorm';

import { Company, User } from '../entities';
import { seedData as companySeedData } from '../seeders/company-seeder';
import { seedData as userSeedData } from '../seeders/user-seeder';

(async () => {
  console.log('Beginning DB seed task.');

  const conn = await createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'tcc',
    password: 'tcc_password',
    database: 'tcc',
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber',
    },
  });
  console.log('DB connected.');

  const companies = await Company.create(companySeedData);
  const users = await User.create(userSeedData);
  await Company.save(companies);
  await User.save(users);

  // Close connection
  await conn.close();
  console.log('DB connection closed.');

  console.log('Finished DB seed task.');
})();
