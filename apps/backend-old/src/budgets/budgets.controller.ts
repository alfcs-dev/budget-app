import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  create(@Body() createBudgetDto: CreateBudgetDto, @Request() req) {
    return this.budgetsService.create(createBudgetDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets for the user' })
  findAll(@Request() req) {
    return this.budgetsService.findAll(req.user.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get budget summary with actual vs planned' })
  getBudgetSummary(@Request() req, @Query('period') period: string = 'MONTHLY') {
    return this.budgetsService.getBudgetSummary(req.user.id, period);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific budget' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.budgetsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a budget' })
  update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Request() req,
  ) {
    return this.budgetsService.update(id, updateBudgetDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a budget' })
  remove(@Param('id') id: string, @Request() req) {
    return this.budgetsService.remove(id, req.user.id);
  }
}
