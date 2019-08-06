const authorizationUser = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZDNiMGQwYTk5MzIwZTNmMGNlODBiOTYiLCJpYXQiOjE1NjQxNTEyMjV9.4TCrgHxoOvOQ_B4-1e5Iw7IZtogoJB1Uuj73Qm0IJoM";
const authorizationAdmin = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZDMxNTA2ZjU2OGJmODEwMzJmYTQzNzAiLCJpYXQiOjE1NjM1MTM4NzF9.mRqN3BFOT-zfPAqQFdmpEqCWEA_U09CM9AVYeoCmGTo';
module.exports.requestOfPostUsers = {
    headers: {
        authorization: authorizationAdmin,
    },
    body: {
        email: 'marjorie@labo.la',
        password: '123456'
    },
};

/* [{
    type: 'return',
    value: `localhost:${port}`,
}]; */
//http localhost:8080 /users
module.exports.requestOfGetUsersById_admin = {
    headers: {
        authorization: authorizationAdmin,
    },
    params: {
        uid: '5d3b0d0a99320e3f0ce80b96',
    }
};

module.exports.requestOfGetUsersById_user = {
    headers: {
        authorization: authorizationUser,
    },
    params: {
        uid: '5d3b0d0a99320e3f0ce80b96',
    }
};
module.exports.requestOfGetUsersByEmail_admin = {
    headers: {
        authorization: authorizationAdmin,
    },
    params: {
        uid: 'marjorie@labo.la',
    }
};

module.exports.requestOfGetUsersByEmail_user = {
    headers: {
        authorization: authorizationUser,
    },
    params: {
        uid: 'marjorie@labo.la',
    }
};

module.exports.requestOfPutUsersById_admin = {
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
    headers: {
        authorization: authorizationUser,
    },
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: '5d3b0d0a99320e3f0ce80b96',
    }
};
module.exports.requestOfPutUsersByEmail_admin = {
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
    headers: {
        authorization: authorizationUser,
    },
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: 'marjorie@labo.la',
    }
};

module.exports.requestOfDeleteUsersById_admin = {
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
    headers: {
        authorization: authorizationUser,
    },
    body: {
        email: 'marjorie009@labo.la',
        password: 'marjorie'
    },
    params: {
        uid: '5d3b0d0a99320e3f0ce80b96',
    }
};
module.exports.requestOfDeleteUsersByEmail_admin = {
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
    headers: {
        authorization: authorizationUser,
    },
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
        uid: 'marjorie@labo.la',
    }
};


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


//uid del admin 5d31506f568bf81032fa4370,s