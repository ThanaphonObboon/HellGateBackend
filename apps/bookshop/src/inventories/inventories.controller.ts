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
  UseGuards,
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import {
  AdjustInventoriesDto,
  StockHistoryDto,
} from 'models/Inventories-model/Inventories-model.dto';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import { RequestPageParam } from 'models/pagination-model/request-pagination';
import { HttpResponseMessage } from '@app/common';
import { AuthGuard } from '@app/common/helps/auth.guard';
import { UserRole } from '@app/common/helps/role.enum';
import { Roles } from '@app/common/helps/roles.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOkResponsePaginated } from '@app/common/helps/api-ok-response-paginated';

@ApiTags('inventories')
@UseGuards(AuthGuard)
@Roles(UserRole.Admin)
@Controller('api/inventories')
export class InventoriesController {
  constructor(
    private readonly _invenService: InventoriesService,
    private readonly _responseMessage: HttpResponseMessage,
  ) {}

  @ApiOkResponse({
    description: 'success',
    type: String,
  })
  @ApiBearerAuth()
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
  @ApiOkResponsePaginated(StockHistoryDto)
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'basicFilter', required: false, type: String })
  @ApiQuery({ name: 'bookId', required: false, type: String })
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
