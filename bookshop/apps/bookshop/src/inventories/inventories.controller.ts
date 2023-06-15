import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { AdjustInventoriesDto } from 'models/Inventories-model/Inventories-model.dto';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import { RequestPageParam } from 'models/pagination-model/request-pagination';
import { HttpResponseMessage } from '@app/common';

@Controller('api/inventories')
export class InventoriesController {
  constructor(
    private readonly _invenService: InventoriesService,
    private readonly _responseMessage: HttpResponseMessage,
  ) {}

  @Put(':id/adjustStock')
  async adjustStock(
    @Param('id') bookId: string,
    @Body(new CustomValidationPipe()) body: AdjustInventoriesDto,
  ) {
    try {
      await this._invenService.adjustStock(bookId, body);
      return this._responseMessage.Ok();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Get()
  async getInventories(
    @Query('pageSize', new DefaultValuePipe(15), ParseIntPipe) pageSize: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('basicFilter', new DefaultValuePipe('')) basicFilter: string,
    @Query('bookId', new DefaultValuePipe('')) bookId: string,
  ) {
    try {
      const param = new RequestPageParam();
      param.page = page;
      param.pageSize = pageSize;
      param.basicFilter = basicFilter;
      return await this._invenService.getInventories(bookId, param);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
