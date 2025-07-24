import { Test, TestingModule } from '@nestjs/testing';
import { ProveedorController } from './proveedor.controller';

describe('ProveedorController', () => {
  let controller: ProveedorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProveedorController],
    }).compile();

    controller = module.get<ProveedorController>(ProveedorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
