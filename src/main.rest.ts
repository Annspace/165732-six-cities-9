import 'reflect-metadata';
import { RestApplication } from './rest/rest.application.js';
import { Container } from 'inversify';
import { Component } from './shared/types/component.enum.js';

import { createUserContainer } from './shared/modules/user/user.container.js';
import { createRestContainer } from './rest/rest.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';
import { createAuthContainer } from './shared/modules/auth/auth.container.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createAuthContainer()
  );
  const application = appContainer.get<RestApplication>(Component.RestApplication);
  application.init();
}

bootstrap();
