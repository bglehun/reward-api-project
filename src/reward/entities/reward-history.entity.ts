import {
  Column, CreateDateColumn,
  DeleteDateColumn,
  Entity, Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum RewardHistoryType {
  SAVE = 'save',
  USE = 'use',
}

@Index('idx_id_userId_expiredAt',['id', 'userId', 'expiredAt'])
@Index('idx_userId_createdAt_expiredAt',['userId', 'createdAt', 'expiredAt'])
@Entity('rewardHistory', { schema: 'test' })
export class RewardHistory {
  @ApiProperty({ description: '적립금 내역 고유 ID' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint',})
  id: number;

  @ApiProperty({ description: '사용자 고유 ID' })
  @PrimaryColumn({ type: 'varchar', length: 40 })
  userId: string;

  @ApiProperty({ description: 'transaction ID (적립금이 발생한 거래의 고유 ID)' })
  @Column({ type: 'varchar', nullable: false, length: 40, unique: true })
  trId: string;

  @ApiProperty({
    type: String,
    enum: RewardHistoryType,
    description: '적립금 내역 타입',
  })
  @Column({ type: 'enum', enum: RewardHistoryType, default: RewardHistoryType.SAVE })
  type: RewardHistoryType;

  @ApiProperty({ description: '적립금' })
  @Column({ type: 'integer', unsigned: true, nullable: false, default: 0 })
  reward: number;

  @ApiProperty({ description: '적립금 내 사용 가능한 적립금' })
  @Column({ type: 'integer', unsigned: true, nullable: false, default: 0 })
  remainReward: number;

  @ApiProperty({
    description: '적립금 시 사용한 적립금 정보 (적립금 사용 취소 시 필요한 데이터)',
  })
  @Column({ type: 'simple-json', nullable: true })
  usedRewardList: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '만료일 (soft delete)' })
  @DeleteDateColumn()
  expiredAt: Date;
}
