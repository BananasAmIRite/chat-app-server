import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ChatRoom from './ChatRoom.entity';
import User from './User.entity';
import { Descendant } from 'slate';

@Entity()
export default class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ChatRoom, (r) => r.messages)
  chatRoom!: ChatRoom;

  @Column({ type: 'json' })
  content!: Descendant[];

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

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
      deletedAt: undefined,
    };
  }
}
