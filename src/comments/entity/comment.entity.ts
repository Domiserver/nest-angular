import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    ManyToOne,
    JoinTable,
  } from 'typeorm';

import { UserEntity } from '../../users/entity/user.entity';
import { IdeaEntity } from '../../ideas/entity/idea.entity';

@Entity('comments')
  export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column('text')
    comment: string;

    @ManyToOne(type => UserEntity)
    @JoinTable()
    author: UserEntity;

    @ManyToOne(type => IdeaEntity, idea => idea.comments)
    idea: IdeaEntity;
  }
