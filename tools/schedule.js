
function cvtDate(date_idx) {
    return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date_idx];
}

function cvtTime(time_name) {
    table = {
        'morning': '上午',
        'afternoon': '下午',
        'evening': '晚上'
    }
    return table[time_name];
}

module.exports = {cvtDate, cvtTime};