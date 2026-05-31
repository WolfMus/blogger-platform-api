import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserDocument, UserModelType } from '../domain/user.entity';
import { HttpStatus } from '@nestjs/common';
import { SortDirection } from '../../../core/dto/pagination.request.dto';
import { UserPaginationRequest } from '../dto/user-pagination.request.dto';
import {
  DomainException,
  Extension,
} from '../../../core/exceptions/domain-exception';

export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async findById(id: string): Promise<UserDocument> {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new DomainException({
        code: HttpStatus.NOT_FOUND,
        message: 'Not Found',
        extensions: [new Extension('User Not Found', 'id')],
      });
    }
    return user;
  }

  async findAll(pagination: UserPaginationRequest): Promise<{
    users: UserDocument[];
    totalCount: number;
  }> {
    const sortBy = pagination.sortBy ?? 'createdAt';
    const sortDirection =
      pagination.sortDirection === SortDirection.Asc ? 1 : -1;
    const pageNumber = pagination.pageNumber ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    const searchLoginTerm = pagination.searchLoginTerm ?? null;
    const searchEmailTerm = pagination.searchEmailTerm ?? null;

    const filter: Record<string, any> = {};
    if (searchLoginTerm && searchEmailTerm) {
      filter.$or = [
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ];
    } else {
      if (searchLoginTerm) {
        filter.login = { $regex: searchLoginTerm, $options: 'i' };
      }
      if (searchEmailTerm) {
        filter.email = { $regex: searchEmailTerm, $options: 'i' };
      }
    }

    const skip = (pageNumber - 1) * pageSize;
    const users = await this.UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await this.UserModel.countDocuments(filter);

    return { users, totalCount };
  }

  async findByLoginAndEmail(login: string, email: string): Promise<void> {
    const user = await this.UserModel.findOne({
      $or: [{ login: login }, { email: email }],
    });
    if (user) {
      const foundedBy = user.login === login ? 'login' : 'email';
      throw new DomainException({
        code: HttpStatus.BAD_REQUEST,
        message: 'Exists',
        extensions: [new Extension('User exist', foundedBy)],
      });
    }
    return;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    if (!user) {
      throw new DomainException({
        code: HttpStatus.UNAUTHORIZED,
        message: 'Exists',
        extensions: [new Extension('User exist', 'email')],
      });
    }
    return user;
  }

  async findByConfirmationCode(code: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      'confirmation.confirmationCode': code,
    });

    if (!user) {
      throw new DomainException({
        code: HttpStatus.BAD_REQUEST,
        message: 'Not Found',
        extensions: [new Extension('Confirmation Code Not Found', 'code')],
      });
    }

    return user;
  }

  async findByRecoveryCode(recoveryCode: string): Promise<UserDocument> {
    console.log(recoveryCode);
    const user = await this.UserModel.findOne({
      'recovery.recoveryCode': recoveryCode,
    });

    if (!user) {
      throw new DomainException({
        code: HttpStatus.BAD_REQUEST,
        message: 'Not Found',
        extensions: [new Extension('Recovery Code Not Found', 'recoveryCode')],
      });
    }

    return user;
  }

  async findByEmailOrFail(email: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      email: email,
    });

    if (!user) {
      throw new DomainException({
        code: HttpStatus.BAD_REQUEST,
        message: 'Not Found',
        extensions: [new Extension('Confirmation Code Not Found', 'email')],
      });
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.UserModel.findOne({
      email: email,
    });

    return user;
  }

  async save(user: UserDocument): Promise<void> {
    await user.save();
    return;
  }

  async deleteById(id: string): Promise<void> {
    const userDeleted = await this.UserModel.findByIdAndDelete(id);
    if (userDeleted === null) {
      throw new DomainException({
        code: HttpStatus.NOT_FOUND,
        message: 'Not Found',
        extensions: [new Extension('User Not Found', 'id')],
      });
    }
    return;
  }
}
