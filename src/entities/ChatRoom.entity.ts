import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Message from './Message.entity';
import User from './User.entity';

@Entity()
export default class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, {
    eager: true,
  })
  owner!: User;

  @ManyToMany(() => User, (u) => u.chatrooms)
  users!: User[];

  @OneToMany(() => Message, (m) => m.chatRoom)
  messages!: Message[];
}
