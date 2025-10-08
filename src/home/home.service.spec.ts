import { Test, TestingModule } from '@nestjs/testing';
import { HomeVideoService } from './home.service';
// import { HomeService } from './home.service';

describe('HomeService', () => {
  let service: HomeVideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeVideoService],
    }).compile();

    service = module.get<HomeVideoService>(HomeVideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
