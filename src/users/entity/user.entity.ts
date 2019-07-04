import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { IdeaEntity } from '../../ideas/entity/idea.entity';
import { UserRO } from '../dto/user.dto';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn( )
  created: Date;

  @Column({ type: 'varchar', length: 60, unique: true, nullable: true })
  username: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({default: ''})
  avatar: string;

  @OneToMany(type => IdeaEntity, idea => idea.author)
  ideas: IdeaEntity[];

  @ManyToMany(type => IdeaEntity, {cascade: true})
  @JoinTable()
  bookmarks: IdeaEntity[];

  @BeforeInsert()
  async hashPassword() {
      this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken: boolean = true): UserRO {
      const { id, created, username, token, avatar } = this;
      const responseObject: UserRO = {
         id,
         created,
         username,
      };

      if (this.ideas) {
        responseObject.ideas = this.ideas;
      }

      if (this.bookmarks) {
        responseObject.bookmarks = this.bookmarks;
      }

      if (showToken) {
        responseObject.token = token;
      }

      return responseObject;
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token(): string {
    const { id, username } = this;
    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '7d'},
    );
  }
}
