import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ChatRoom, { ChatRoomJSON } from './ChatRoom.entity';

export interface UserJSON {
  id: number;
  username: string;
  chatrooms: ChatRoomJSON[];
  deletedAt?: undefined;
}

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user!: string;

  @Column()
  password!: string; // don't worry this is hashed

  @OneToMany(() => ChatRoom, (r) => r.owner)
  roomOwners!: ChatRoom[];

  @ManyToMany(() => ChatRoom, (r) => r.users)
  @JoinTable()
  chatrooms!: ChatRoom[];

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: Date;

  toWebJson(): UserJSON {
    return {
      id: this.id,
      username: this.user,
      chatrooms: this.chatrooms?.map((e) => e.toWebJson()),
      deletedAt: undefined,
    };
  }
}
