import * as core from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { fillRDO } from '../../helpers/index.js';
import { OfferFullRDO, OfferService, OfferBasicRDO, DEFAULT_OFFERS_COUNT, MAX_PREMIUM_OFFERS_COUNT, CreateOfferDTO } from './index.js';
import { HttpError } from '../../../rest/errors/index.js';
import { UserService } from '../user/index.js';

type ParamsGetOffer = {
  offerId: string;
  city?: string;
}

@injectable()
export class OfferController extends BaseController {
  constructor(
  @inject(Component.Logger) logger: Logger,
  @inject(Component.OfferService) private readonly offerService: OfferService,
  @inject(Component.UserService) private readonly userService: UserService
  ) {
    super(logger);

    this.logger.info('Register routes for Offer Controller...');

    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.createOffer});
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getOffers});
    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.getPremiumOffers});
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.getOfferDetails});
    this.addRoute({path: '/:offerId', method: HttpMethod.Patch, handler: this.updateOffer});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler:this.deleteOffer});
  }

  public async createOffer(req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDTO>, res: Response): Promise<void> {
    const reqToken = req.get('X-token');
    if (!reqToken) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Access denied. Only for authorized users.',
        'RestOfferController'
      );
    }

    const {body: requestOffer} = req;
    const newOffer = await this.offerService.create(requestOffer);
    this.created(res, fillRDO(OfferFullRDO, newOffer));
  }

  public async getOffers(req: Request, res: Response): Promise<void> {
    const {params: {count}} = req;
    const offersCount = count ? Number.parseInt(count, 10) : DEFAULT_OFFERS_COUNT;

    const offers = await this.offerService.find(offersCount);

    const offersResponse = offers?.map((offer) => fillRDO(OfferBasicRDO, offer));
    this.ok(res, offersResponse);
  }

  public async getPremiumOffers(req: Request, res: Response): Promise<void> {
    const {query: {city}} = req;
    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Incorrect path Error. Check your request',
        'RestOfferController'
      );
    }

    const premiumOffers = await this.offerService.findPremium(city.toString(), MAX_PREMIUM_OFFERS_COUNT, '64760b2a6a803a09ab8e9a34');

    const offersResponse = premiumOffers?.map((offer) => fillRDO(OfferBasicRDO, offer));
    this.ok(res, offersResponse);
  }

  public async getOfferDetails({params}: Request<core.ParamsDictionary| ParamsGetOffer>, res: Response): Promise<void> {
    const {offerId} = params;
    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Incorrect path Error. Check your request',
        'RestOfferController'
      );
    }

    const isFavorite = await this.userService
      .findById('6487275952b1fd03b2bbcca6')
      .then((user) => user ? user.favorites.map((offer) => offer.toString()).includes(offerId) : false);

    const offer = await this.offerService.findById(offerId, isFavorite);
    this.ok(res, fillRDO(OfferFullRDO, offer));
  }

  public async updateOffer(req: Request, res: Response): Promise<void> {
    const reqToken = req.get('X-token');
    if (!reqToken) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Access denied. Only for authorized users.',
        'RestOfferController'
      );
    }
    const {params: {offerId}, body: updateData} = req;
    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Incorrect path Error. Check your request',
        'RestOfferController'
      );
    }
    const updatedOffer = await this.offerService.updateById(offerId, updateData);
    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }
    this.ok(res, fillRDO(OfferFullRDO, updatedOffer));
  }

  public async deleteOffer(req: Request, res: Response): Promise<void> {
    const reqToken = req.get('X-token');
    if (!reqToken) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Access denied. Only for authorized users.',
        'RestOfferController'
      );
    }
    const {params: {offerId}} = req;
    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Incorrect path Error. Check your request',
        'RestOfferController'
      );
    }
    const offer = await this.offerService.deleteById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.noContent(res, {message: 'Offer was deleted successfully.'});
  }
}
