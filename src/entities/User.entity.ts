import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import ChatRoom from './ChatRoom.entity';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user!: string;

  @Column()
  password!: string; // don't worry this is hashed

  @ManyToMany(() => ChatRoom, (r) => r.users, { cascade: true })
  @JoinTable()
  chatrooms!: ChatRoom[];
}
