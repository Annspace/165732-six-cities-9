import 'reflect-metadata';
import { RestApplication } from './rest/rest.application.js';
import { Container } from 'inversify';
import { Component } from './shared/types/component.enum.js';

import { createUserContainer } from './shared/models/user/user.container.js';
import { createRestContainer } from './rest/rest.container.js';
import { createOfferContainer } from './shared/models/offer/offer.container.js';
import { createCommentContainer } from './shared/models/comment/comment.container.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer()
  );
  const application = appContainer.get<RestApplication>(Component.RestApplication);
  application.init();
}

bootstrap();
