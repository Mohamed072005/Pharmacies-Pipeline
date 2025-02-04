import { Controller, Get, Post, Put, Body, Param, Query, NotFoundException} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../providers/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../schemas/user.schema';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.', type: [User] })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get('email')
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiResponse({
    status: 200,
    description: 'Return the user with the specified email.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByEmail(@Query('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get('username')
  @ApiOperation({ summary: 'Find a user by username' })
  @ApiResponse({
    status: 200,
    description: 'Return the user with the specified username.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByUsername(@Query('username') username: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user with the specified ID.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }


}
