import { Connection } from 'typeorm';

import { testConn } from './test-conn';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

describe('sample', () => {
  it('should do somthing', () => {
    expect(true).toEqual(true);
  });
});
