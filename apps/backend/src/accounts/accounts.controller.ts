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
import { AccountsService } from './accounts.service';
import { CreateAccountSchema, UpdateAccountSchema } from '@budget-manager/database';
import { ZodValidation } from '../common/pipes/zod-validation.pipe';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @UsePipes(ZodValidation(CreateAccountSchema))
  create(@Body() createAccountData: any) {
    return this.accountsService.create(createAccountData);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.accountsService.findAll(userId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.accountsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Get(':id/balance')
  getBalance(@Param('id') id: string) {
    return this.accountsService.getAccountBalance(id);
  }

  @Patch(':id')
  @UsePipes(ZodValidation(UpdateAccountSchema))
  update(@Param('id') id: string, @Body() updateAccountData: any) {
    return this.accountsService.update(id, updateAccountData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.accountsService.remove(id);
    return { message: 'Account deleted successfully' };
  }
}