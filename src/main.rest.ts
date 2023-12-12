import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication, createRestApplicationContainer } from './rest/index.js';
import { getErrorMessage } from './shared/helpers/common.js';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
  );

  const restApp = appContainer.get<RestApplication>(Component.RestApplication);
  await restApp.init();
}

bootstrap().catch((error) => {
  console.log(`Bootstrap Rest Application error: ${getErrorMessage(error)}`);
});
