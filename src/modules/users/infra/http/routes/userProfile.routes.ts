import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import UserProfileController from '@modules/users/infra/controllers/UserProfileController';

import ensureAuthenticated from '@modules/users/infra/http/midlewares/ensureAuthenticated';

const userProfileRouter = Router();
const userProfileController = new UserProfileController();

userProfileRouter.use(ensureAuthenticated);

userProfileRouter.get('/', userProfileController.show);
userProfileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  userProfileController.update,
);

export default userProfileRouter;
