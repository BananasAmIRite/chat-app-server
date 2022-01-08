import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Message from './Message.entity';
import User, { UserJSON } from './User.entity';

export interface ChatRoomJSON {
  id: number;
  name: string;
  owner: UserJSON;
  users?: UserJSON[];
  deletedAt?: undefined;
}

@Entity()
export default class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, (u) => u.roomOwners)
  owner!: User;

  @ManyToMany(() => User, (u) => u.chatrooms)
  users!: User[];

  @OneToMany(() => Message, (m) => m.chatRoom, { onDelete: 'CASCADE' })
  messages!: Message[];

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: Date;

  toWebJson(): ChatRoomJSON {
    return {
      id: this.id,
      name: this.name,
      owner: this.owner?.toWebJson(),
      users: this.users?.map((e) => e.toWebJson()),
      deletedAt: undefined,
    };
  }
}
