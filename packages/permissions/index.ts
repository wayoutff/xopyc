const OWNER_EMAILS = ['ii@ii.ii', 'statix-dev@ya.ru'];

const permissions = {
  base: {
    create: false,
    update: false,
    delete: false,
  },
  admin: {
    create: true,
    update: true,
    delete: false,
  },
  root: {
    create: true,
    update: true,
    delete: true,
  },
};

export function hasPermission(scope) {
  return function (req, res, next) {
    if (!req.user)
      return res.status(403).json({
        message: `You don't have a permission (not loggedIn)`,
        error: 'Error: permission denied',
      });

    const { role } = req.user;
    if (!req.user || !role || !scope)
      return res.status(403).json({
        message: `Something went wrong`,
        error: 'Permissions: missiong property role or scope',
      });
    console.log(permissions[role], permissions[role][scope]);
    if (permissions[role] && permissions[role][scope]) return next();
    else
      return res.status(403).json({
        message: `You don't have a permission`,
        error: 'Error: permission denied',
      });
  };
}

export function hasOwnerRights(req, res, next) {
  if (!req.user)
    return res.status(403).json({
      message: `You don't have a permission (not loggedIn)`,
      error: 'Error: permission denied',
    });

  if (OWNER_EMAILS.includes(req.user.email)) {
    return next();
  } else {
    return res.status(403).json({
      message: `You don't have a permission`,
      error: 'Error: permission denied',
    });
  }
}
