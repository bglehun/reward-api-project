import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('reward', { schema: 'test' })
export class Reward {
  @ApiProperty({ description: '사용자 고유 ID' })
  @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
  userId: string;

  @ApiProperty({ description: '총 적립금' })
  @Column({ type: 'integer', unsigned: true, nullable: false, default: 0 })
  savedReward: number;

  @ApiProperty({ description: '사용한 적립금' })
  @Column({ type: 'integer', unsigned: true, nullable: false, default: 0 })
  usedReward: number;

  @ApiProperty({ description: '만료된 적립금' })
  @Column({ type: 'integer', unsigned: true, nullable: false, default: 0 })
  expiredReward: number;

  @ApiProperty({ description: '사용 가능한 적립금' })
  @Column({ type: 'integer', unsigned: true, nullable: false, default: 0 })
  remainReward: number;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updatedAt: Date;
}
