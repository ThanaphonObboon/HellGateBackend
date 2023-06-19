import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import { StockHistoryDto } from 'models/Inventories-model/Inventories-model.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { InventoriesService } from './inventories.service';
import { Controller } from '@nestjs/common';

@Controller()
export class InventoriesController {
  constructor(private readonly _inventory: InventoriesService) {}

  @MessagePattern({ cmd: 'service.inventory.histories' })
  async getStockHistories(
    @Payload() payload: { bookId: string; param: RequestPageParam },
  ): Promise<PagedResult<StockHistoryDto>> {
    try {
      return await this._inventory.getStockHistory(
        payload.bookId,
        payload.param,
      );
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern({ cmd: 'service.inventory.adjust.stock' })
  async adjustStock(
    @Payload() payload: { bookId: string; amount: number },
  ): Promise<boolean> {
    try {
      await this._inventory.adjustStock(payload.bookId, payload.amount);
      return true;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
}
