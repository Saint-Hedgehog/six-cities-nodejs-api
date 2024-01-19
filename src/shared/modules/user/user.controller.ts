import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { OfferBasicRDO, OfferService } from '../offer/index.js';
import { CreateUserDTO, NewUserRDO, UserService } from './index.js';
import { HttpError } from '../../../rest/errors/index.js';
import { createSHA256, fillRDO } from '../../helpers/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
  @inject(Component.Logger) logger: Logger,
  @inject(Component.UserService) private readonly userService: UserService,
  @inject(Component.OfferService) private readonly rentOfferService: OfferService,
  @inject(Component.Config) private readonly configService: Config<RestSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for User Controller...');
    this.addRoute({path: '/register', method: HttpMethod.Post, handler: this.register});
    this.addRoute({path: '/auth', method: HttpMethod.Get, handler: this.checkAuth});
    this.addRoute({path: '/auth', method: HttpMethod.Post, handler: this.requestAuth});
    this.addRoute({path: '/logout', method: HttpMethod.Delete, handler: this.logout});
    this.addRoute({path: '/:userId/avatar', method: HttpMethod.Put, handler: this.loadAvatar});
    this.addRoute({path: '/:userId/favorites/:offerId', method: HttpMethod.Put, handler:this.updateFavoriteStatus});
    this.addRoute({path: '/:userId/favorites/', method: HttpMethod.Get, handler:this.getFavorites});
  }

  public async register(req: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDTO>, res: Response): Promise<void> {
    const {body: registerData} = req;
    const existUser = await this.userService.findByEmail(registerData.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'User with such email already exists. Please enter another email.',
        'UserController'
      );
    }

    const newUser = await this.userService.create(registerData, this.configService.get('SALT'));

    this.created(res, fillRDO(NewUserRDO, newUser));
  }

  public checkAuth(req: Request, _res: Response): void {
    const reqToken = req.get('X-token');

    if (!reqToken) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Request Error - Bad token.',
        'UserController'
      );
    }
  }

  public async requestAuth(req: Request, _res: Response): Promise<void> {
    const {body: {email, password}} = req;
    const existUser = await this.userService.findByEmail(email);

    if (!existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${email} doesn't exist.`,
        'UserController'
      );
    }

    const encryptPassword = createSHA256(password, this.configService.get('SALT'));

    if (encryptPassword !== existUser.getPassword()) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Wrong password.',
        'UserController'
      );
    }
  }

  public async loadAvatar(_req: Request, _res: Response): Promise<void> {
    throw new Error('Ещё не реализован');
  }

  public async logout(req: Request, _res: Response): Promise<void> {
    const reqToken = req.get('X-token');

    if (!reqToken) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Request Error - Bad token.',
        'UserController'
      );
    }
  }

  public async updateFavoriteStatus(req: Request, res: Response): Promise<void> {
    if(!Object.keys(req.params).includes('userId') ||
      !Object.keys(req.params).includes('offerId') ||
      !Object.keys(req.query).includes('isFav')) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Incorrect path Error. Check your request',
        'UserController'
      );
    }

    const {params: {userId, offerId}, query: {isFav}} = req;

    if (!userId || !offerId || !isFav) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Incorrect path Error. Check your request',
        'UserController'
      );
    }

    const existOffer = await this.rentOfferService.findById(offerId, false);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Offer with such id not found',
        'UserController'
      );
    }

    const status = Number.parseInt(isFav.toString(), 10) === 1;
    const updateUser = await this.userService.changeFavoriteStatus(userId, existOffer.id, status);

    this.send(res, 201, updateUser);
  }

  public async getFavorites(req: Request, res: Response): Promise<void> {
    if(!Object.keys(req.params).includes('userId')) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Incorrect path Error. Check your request',
        'UserController'
      );
    }

    const {params: {userId}} = req;
    const existedUserFavorites = await this.userService.findUserFavorites(userId);
    const favoritesResponse = existedUserFavorites?.map((offer) => fillRDO(OfferBasicRDO, offer));

    this.ok(res, favoritesResponse);
  }
}
