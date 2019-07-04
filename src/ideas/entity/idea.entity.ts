import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, UpdateDateColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { UserEntity } from '../../users/entity/user.entity';
import { CommentEntity } from '../../comments/entity/comment.entity';

@Entity('ideas')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn( )
  created: Date;

  @UpdateDateColumn( )
  updated: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  idea: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne( type => UserEntity, author => author.ideas)
  author: UserEntity;

  @ManyToMany(type => UserEntity, {cascade: true})
  @JoinTable()
  upvotes: UserEntity[];

  @ManyToMany(type => UserEntity, {cascade: true})
  @JoinTable()
  downvotes: UserEntity[];

  @OneToMany(type => CommentEntity, comment => comment.idea, { cascade: true })
  comments: CommentEntity[];
}
