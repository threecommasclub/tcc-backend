// Code that is used to seed the database.

import { createConnection, getConnectionOptions } from 'typeorm';

import { Company, User } from '../entities';
import { seedData as companySeedData } from '../seeders/company-seeder';
import { seedData as userSeedData } from '../seeders/user-seeder';

(async () => {
  console.log('Beginning DB seed task.');

  // read connection options from .env)
  const connectionOptions = await getConnectionOptions();

  const conn = await createConnection({
    ...connectionOptions,
    dropSchema: true,
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
