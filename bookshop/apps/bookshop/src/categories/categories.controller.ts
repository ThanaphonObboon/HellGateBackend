import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { HttpResponseMessage } from '@app/common';
import { RequestPageParam } from 'models/pagination-model/request-pagination';
import {
  CategoryDto,
  CreateCategoryDto,
} from 'models/category-model/category-model.dto';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import { AuthGuard } from '@app/common/helps/auth.guard';
import { Roles } from '@app/common/helps/roles.decorator';
import { UserRole } from '@app/common/helps/role.enum';
import { ApiOkResponsePaginated } from '@app/common/helps/api-ok-response-paginated';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(
    private _category: CategoriesService,
    private readonly _responseMessage: HttpResponseMessage,
  ) {}
  @ApiOkResponsePaginated(CategoryDto)
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'basicFilter', required: false, type: String })
  @Get()
  async getCategories(
    @Query('pageSize', new DefaultValuePipe(15), ParseIntPipe) pageSize = 15,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('basicFilter', new DefaultValuePipe('')) basicFilter = '',
  ) {
    try {
      const param = new RequestPageParam();
      param.page = page;
      param.pageSize = pageSize;
      param.basicFilter = basicFilter;
      const res = await this._category.getCategories(param);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @ApiOkResponse({
    description: 'success',
    type: CategoryDto,
  })
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    try {
      const res = await this._category.getCategoryById(id);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @ApiOkResponse({
    description: 'success',
    type: CategoryDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.Admin)
  @Post()
  async createCategory(
    @Body(new CustomValidationPipe()) body: CreateCategoryDto,
  ) {
    try {
      const res = await this._category.createCategory(body);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @ApiOkResponse({
    description: 'success',
    type: String,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.Admin)
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: CreateCategoryDto,
  ) {
    try {
      const res = await this._category.updateCategory(id, body);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @ApiOkResponse({
    description: 'success',
    type: String,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.Admin)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    try {
      const res = await this._category.deleteCategory(id);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
