import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseSchema, UpdateExpenseSchema } from '@budget-manager/database';
import { ZodValidation } from '../common/pipes/zod-validation.pipe';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @UsePipes(ZodValidation(CreateExpenseSchema))
  create(@Body() createExpenseData: any) {
    return this.expensesService.create(createExpenseData);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('budgetId') budgetId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('period') period?: 'week' | 'month' | 'year'
  ) {
    return this.expensesService.findAll(userId, budgetId, categoryId, period);
  }

  @Get('category/:categoryId')
  getCategoryExpenses(
    @Param('categoryId') categoryId: string,
    @Query('period') period?: 'week' | 'month' | 'year'
  ) {
    return this.expensesService.getCategoryExpenses(categoryId, period);
  }

  @Get('budget/:budgetId/utilization')
  getBudgetUtilization(
    @Param('budgetId') budgetId: string,
    @Query('limit') limit: string,
    @Query('period') period?: 'week' | 'month' | 'year'
  ) {
    const budgetLimit = parseFloat(limit) || 0;
    return this.expensesService.getBudgetUtilization(budgetId, budgetLimit, period);
  }

  @Get('date-range')
  getExpensesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('userId') userId?: string
  ) {
    return this.expensesService.getExpensesByDateRange(
      new Date(startDate),
      new Date(endDate),
      userId
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ZodValidation(UpdateExpenseSchema))
  update(@Param('id') id: string, @Body() updateExpenseData: any) {
    return this.expensesService.update(id, updateExpenseData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.expensesService.remove(id);
    return { message: 'Expense deleted successfully' };
  }
}