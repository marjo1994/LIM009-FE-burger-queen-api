/******* *RESPONSE*******************/
module.exports.responseOfPostUsers = {
    body: {
        roles: { admin: false },
        _id: '5d43b0295796442f0b3902ab',
        email: 'labo@labo.la',
    }
};
module.exports.responseOfGetUsers = [{
        roles: { admin: true },
        _id: '5d43b0275796442f0b3902a9',
        email: 'admin@localhost',
        password: '$2b$10$kkS0/HImPdnaMlCqqE3xiuXHq4P08Cme12e8qq5OzvawozdxC6Lcq',
        __v: 0
    },
    {
        roles: { admin: false },
        _id: '5d43b0285796442f0b3902aa',
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
        _id: '5d439680250f04203e664cb8',
        email: 'labo@labo.la',
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