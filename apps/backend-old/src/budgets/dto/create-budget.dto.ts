import { IsString, IsNumber, IsEnum, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { BudgetPeriod } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
  @ApiProperty({ example: 'Monthly Groceries Budget' })
  @IsString()
  name: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: BudgetPeriod, example: 'MONTHLY' })
  @IsEnum(BudgetPeriod)
  period: BudgetPeriod;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ example: 'category-id-here' })
  @IsString()
  categoryId: string;
}
