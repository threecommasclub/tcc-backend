import { Resolver, Query, Mutation, Arg } from 'type-graphql';

import { Company, CompanyCreateInput } from '../entities';

@Resolver()
export class CompanyResolver {
  @Query(() => [Company])
  companies() {
    return Company.find();
  }

  @Mutation(() => Company)
  async companyCreate(@Arg('input') input: CompanyCreateInput) {
    try {
      const company = await Company.insert(input);
      return Company.findOne({ id: company.identifiers[0].id });
    } catch (err) {
      console.log(err);
      throw new Error('companyCreate was failed');
    }
  }
}
