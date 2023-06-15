import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AdjustInventoriesDto,
  StockHistoryDto,
} from 'models/Inventories-model/Inventories-model.dto';
import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class InventoriesService {
  constructor(@Inject('BOOK_SERVICE') private client: ClientProxy) {}

  async getInventories(
    bookId: string,
    param: RequestPageParam,
  ): Promise<PagedResult<StockHistoryDto>> {
    const result = this.client.send<PagedResult<StockHistoryDto>>(
      { cmd: 'service.inventory.histories' },
      { bookId, param },
    );
    return await lastValueFrom(result);
  }
  async adjustStock(bookId: string, body: AdjustInventoriesDto): Promise<void> {
    const result = this.client.send<boolean>(
      { cmd: 'service.inventory.adjust.stock' },
      { bookId, amount: body.amount },
    );
    await lastValueFrom(result);
  }
}
