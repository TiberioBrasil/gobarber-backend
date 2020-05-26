import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/midlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providersController = new ProvidersController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required,
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);

appointmentsRouter.get('/me', providersController.index);

export default appointmentsRouter;
