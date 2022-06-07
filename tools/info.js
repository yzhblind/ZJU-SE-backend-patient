const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../models');

const url_list=[
    'https://s6.jpg.cm/2022/06/03/PGw2jT.webp',
    'https://s6.jpg.cm/2022/06/03/PGw0F6.webp',
    'https://s6.jpg.cm/2022/06/03/PGwfxD.webp',
    'https://s6.jpg.cm/2022/06/03/PGwz6p.webp',
    'https://s6.jpg.cm/2022/06/03/PGwBoX.webp'
]

function getPicUrlByPid(pid){
    return url_list[parseInt(pid)]
}

module.exports = { getPicUrlByPid };
