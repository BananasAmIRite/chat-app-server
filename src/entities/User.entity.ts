import { BaseEntity, Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import ChatRoom from './ChatRoom.entity';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user!: string;

  @Column()
  password!: string; // don't worry this is hashed

  @ManyToMany(() => ChatRoom, (r) => r.users)
  @JoinTable()
  chatrooms!: ChatRoom[];

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: Date;

  toWebJson() {
    return {
      id: this.id,
      username: this.user,
    };
  }
}
