import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('oauth_user')
export class OauthUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'openid', length: 128, nullable: true })
  openid: string;

  @Index()
  @Column({ name: 'unionid', length: 128, nullable: true })
  unionid: string;

  @Index()
  @Column({ name: 'vendor', length: 32 })
  vendor: string;

  @Column({ name: 'session_key', length: 256, nullable: true })
  sessionKey: string;

  @Column({ name: 'phone_number', length: 32, nullable: true })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  raw_data: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
