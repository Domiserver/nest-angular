import { Test, TestingModule } from '@nestjs/testing';
import { IdeasResolver } from './ideas.resolver';

describe('IdeasResolver', () => {
  let resolver: IdeasResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdeasResolver],
    }).compile();

    resolver = module.get<IdeasResolver>(IdeasResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
