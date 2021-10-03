import {
  BaseEntity,
  Column,
  DeleteDateColumn,
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

  @ManyToMany(() => User, (u) => u.chatrooms, { cascade: true })
  users!: User[];

  @OneToMany(() => Message, (m) => m.chatRoom, { onDelete: 'CASCADE' })
  messages!: Message[];

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: Date;

  toWebJson() {
    return { id: this.id, owner: this.owner?.toWebJson(), users: this.users?.map((e) => e.toWebJson()) };
  }
}
