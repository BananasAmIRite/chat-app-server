import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import ChatRoom from './ChatRoom.entity';
import User from './User.entity';

@Entity()
export default class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ChatRoom, (r) => r.messages)
  chatRoom!: ChatRoom;

  @Column()
  content!: string;

  @ManyToOne(() => User)
  user!: User;

  toJson() {
    return {
      type: 'message',
      message: this.content,
      user: this.user.id,
    };
  }
}
