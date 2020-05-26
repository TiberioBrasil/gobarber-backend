import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';

export default class UserProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.body;

    const showUserProfile = container.resolve(ShowUserProfileService);

    const user = await showUserProfile.execute({ user_id });

    return res.json(user);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { user_id, name, email, old_password, password } = req.body;

    const updateUserProfile = container.resolve(UpdateUserProfileService);

    const user = await updateUserProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    delete user.password;

    return res.json(user);
  }
}
