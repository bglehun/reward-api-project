import { IsNumber, IsOptional, IsString, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class saveRewardDto {
  @ApiProperty({ description: '적립금', minimum: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @Min(1)
  saveReward: number;

  @ApiProperty({ description: 'transaction ID (적립금이 발생한 거래의 고유 ID)' })
  @IsString()
  @IsOptional()
  trId: string;
}

export class useRewardDto {
  @ApiProperty({ description: '사용할 적립금', minimum: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @Min(1)
  useReward: number;

  @ApiProperty({ description: 'transaction ID (적립금을 사용한 거래의 고유 ID)' })
  @IsString()
  @IsOptional()
  trId: string;
}

export class getRewardListDto {
  @ApiProperty({ description: '페이지네이션 정보. 마지막으로 전달받은 적립금 내역의 id', required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  cursor: number;
}
