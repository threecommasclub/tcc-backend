import { MiddlewareFn } from 'type-graphql';

import { Context } from '../types/context';

export const isAuthenticated: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.user) {
    throw new Error('Not authenticated');
  }
  return next();
};

export const authorized = (role: string): MiddlewareFn<Context> => ({ context }, next) => {
  if (context.user.role !== role) {
    throw new Error(`you must have ${role} role`);
  }
  return next();
};
