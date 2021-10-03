import { BaseEntity, Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: Date;

  toJson() {
    return {
      type: 'message',
      message: this.content,
      user: this.user.id,
    };
  }

  toWebJson() {
    return {
      ...this,
      user: this.user?.toWebJson(),
      chatRoom: this.chatRoom?.toWebJson(),
    };
  }
}
