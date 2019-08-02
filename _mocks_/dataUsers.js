const JWT = require('jsonwebtoken');
const { secret } = require('../config');


const authorizationAdmin = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZDNiMGQwYTk5MzIwZTNmMGNlODBiOTYiLCJpYXQiOjE1NjQxNTEyMjV9.4TCrgHxoOvOQ_B4-1e5Iw7IZtogoJB1Uuj73Qm0IJoM";

module.exports.requestOfAuth_admin = {
    method: 'POST',
    body: {
        email: 'admin@localhost',
        password: 'changeme',
    }
};

const token = JWT.sign(module.exports.requestOfAuth_admin, secret);
//const output = { "token": token };
const autorization = JWT.decode(token, secret);
module.exports.authorizationAdministrador = { "token": token };

module.exports.requestOfPostUsers = {
    method: 'POST',
    headers: {
        authorization: module.exports.authorizationAdministrador,
    },
    body: {
        email: 'marjorie@labo.la',
        password: '123456'
    },
};

module.exports.requestOfGetUsers = {
    method: 'GET',
    headers: {
        authorization: authorizationAdmin
    }
};

module.exports.requestOfGetUsersById_admin = {
    method: 'GET',
    headers: {
        authorization: authorizationAdmin,
    },
    params: {
        uid: '5d3b0d0a99320e3f0ce80b96',
    }
};

module.exports.requestOfGetUsersById_user = {
    method: 'GET',
    /* headers: {
        authorization: authorizationUser,
    },
     */
    params: {
        uid: '5d3b0d0a99320e3f0ce80b96',
    }
};
module.exports.requestOfGetUsersByEmail_admin = {
    method: 'GET',
    headers: {
        authorization: authorizationAdmin,
    },
    params: {
        uid: 'marjorie@labo.la',
    }
};

module.exports.requestOfGetUsersByEmail_user = {
    method: 'GET',
    /* headers: {
        authorization: authorizationUser,
    },
     */
    params: {
        uid: 'marjorie@labo.la',
    }
};

module.exports.requestOfPutUsersById_admin = {
    method: 'PUT',
    headers: {
        authorization: authorizationAdmin,
    },
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: '5d3b0d0a99320e3f0ce80b96',
    }
};

module.exports.requestOfPutUsersById_user = {
    method: 'PUT',
    /* headers: {
        authorization: authorizationUser,
    },
     */
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: '5d3b0d0a99320e3f0ce80b96',
    }
};
module.exports.requestOfPutUsersByEmail_admin = {
    method: 'PUT',
    headers: {
        authorization: authorizationAdmin,
    },
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: 'marjorie@labo.la',
    }
};

module.exports.requestOfPutUsersByEmail_user = {
    method: 'PUT',
    /* headers: {
        authorization: authorizationUser,
    },
     */
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: 'marjorie@labo.la',
    }
};

module.exports.requestOfDeleteUsersById_admin = {
    method: 'DELETE',
    headers: {
        authorization: authorizationAdmin,
    },
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: '5d3b0d0a99320e3f0ce80b96',
    }
};
module.exports.requestOfDeleteUsersById_user = {
    method: 'DELETE',
    /* headers: {
        authorization: authorizationUser,
    },
     */
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: '5d3b0d0a99320e3f0ce80b96',
    }
};
module.exports.requestOfDeleteUsersByEmail_admin = {
    method: 'DELETE',
    headers: {
        authorization: authorizationAdmin,
    },
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: 'marjorie@labo.la',
    }
};
module.exports.requestOfDeleteUsersByEmail_user = {
    method: 'DELETE',
    /* headers: {
        authorization: authorizationUser,
    },
     */
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: 'marjorie@labo.la',
    }
};
/******* *RESPONSE*******************/
module.exports.responseOfPostUsers = {
    body: {
        roles: { admin: false },
        _id: '5d3b0d0a99320e3f0ce80b96',
        uid: 'labo@labo.la',
    }
};
module.exports.responseOfGetUsers = [{
        roles: { admin: true },
        _id: '5d43967e250f04203e664cb6',
        email: 'admin@localhost',
        password: '$2b$10$kkS0/HImPdnaMlCqqE3xiuXHq4P08Cme12e8qq5OzvawozdxC6Lcq',
        __v: 0
    },
    {
        roles: { admin: false },
        _id: '5d43967f250f04203e664cb7',
        email: 'test@test.test',
        password: '$2b$10$jAf8gASwkmH.MkhjFpgCe.wnBGSwRccueiZwTSc8atVCZMa/LfDpW',
        __v: 0
    },
    {
        roles: { admin: false },
        _id: '5d439680250f04203e664cb8',
        email: 'labo@labo.la',
        password: '$2b$10$xE.J0B1A/QLerpTIFGOyeOGfpID6ZU1rhy/6F4c94IWfMhExaokU.',
        __v: 0
    }
];

module.exports.responseOfGetUsersByIdorEmail = {
    body: {
        roles: { admin: false },
        _id: '5d3b0d0a99320e3f0ce80b96',
        uid: 'marjorie@labo.la',
    }
};

module.exports.requestOfPutUsersByIdorEmail = {
    body: {
        "message": "Cambios registrados satisfactoriamente"
    },
};

module.exports.responseOfDeleteUsersByIdorEmail = {
    body: {
        "message": "Se borro satisfactoriamente!"
    }
};

//uid del admin 5d31506f568bf81032fa4370,