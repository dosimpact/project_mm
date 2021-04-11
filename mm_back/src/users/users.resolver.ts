import { AuthGuard } from '@/auth/auth.guard';
import { Role } from '@/auth/role.decorator';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserInput,
  CreateUserOutput,
  DeleteUserInput,
  DeleteUserOutput,
  LoginUserInput,
  LoginUserOuput,
  UpdateUserInput,
  UpdateUserOutput,
} from './dtos/mutation-user.dtos';
import {
  GetUserByEmailInput,
  GetUserByEmailOutput,
  GetUserByIdInput,
  GetUserByIdOutput,
  SearchUserInput,
  SearchUserOutput,
} from './dtos/query-user.dtos';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // user - query
  @Query((returns) => SearchUserOutput)
  async searchUser(@Args('input') searchUserInput: SearchUserInput) {
    return this.usersService.searchUsers(searchUserInput);
  }

  @Query((returns) => GetUserByIdOutput)
  async getUserById(@Args('input') getUserByIdInput: GetUserByIdInput) {
    return this.usersService.getUserById(getUserByIdInput);
  }

  @Query((returns) => GetUserByEmailOutput)
  async getUserByEmail(
    @Args('input') getUserByEmailInput: GetUserByEmailInput,
  ) {
    return this.usersService.getUserByEmail(getUserByEmailInput);
  }

  // @UseGuards(AuthGuard)
  // @SetMetadata('lala', 'dosimpact')
  @Role(['Admin', 'Diamond'])
  @Query((returns) => User)
  async me(@Context() context) {
    // console.log(context);
    return context['user'];
  }

  // user - Mutation
  @Mutation((returns) => CreateUserOutput)
  async createUser(@Args('input') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }
  @Mutation((returns) => LoginUserOuput)
  async loginUser(@Args('input') loginUserInput: LoginUserInput) {
    return this.usersService.loginUser(loginUserInput);
  }

  @Mutation((returns) => UpdateUserOutput)
  async updateUser(@Args('input') updateUserInput: UpdateUserInput) {
    return this.usersService.updateUser(updateUserInput);
  }

  @Mutation((returns) => DeleteUserOutput)
  async deleteUser(@Args('input') deleteUserInput: DeleteUserInput) {
    return this.usersService.deleteUser(deleteUserInput);
  }
}
