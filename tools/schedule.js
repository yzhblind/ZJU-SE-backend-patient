const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../models');

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

function cvtTimeToIdx(time_name) {
    table = {
        'morning': 0,
        'afternoon': 1,
        'evening': 2
    }
    return table[time_name];
}

async function cvtScheduleToHumanInfo(schedule_data) {
    ret = [];
    tree = {};
    for(let i = 0; i < schedule_data.length; i++) {
        sch = schedule_data[i];
        doctor_inst = await doctor.find({_id: sch.doctor_id}).exec();
        doctor_name = doctor_inst[0].name;
        depart_id = doctor_inst[0].dept_id;
        department_inst = await department.find({_id: depart_id}).exec();
        department_name = department_inst[0].name;
        ret.push({
            departmentId: depart_id,
            doctorId: sch.doctor_id,
            name: doctor_name,
            department: department_name,
            major: '占位',
            info: doctor_inst[0].intro
        })
        if(tree[department_name] === undefined) {
            tree[department_name] = {
                title: department_name,
                value: depart_id,
                children: [{
                    'title': doctor_name,
                    'value': sch.doctor_id
                }]
            };
        } else {
            tree[department_name].children.push({
                'title': doctor_name,
                'value': sch.doctor_id
            });
        }
    }
    ret_tree = []
    for(let depart in tree) {
        ret_tree.push({
            title: depart,
            value: tree[depart].value,
            children: tree[depart].children
        })
    }
    return [ret, ret_tree];
}

module.exports = {cvtDate, cvtTime, cvtScheduleToHumanInfo, cvtTimeToIdx};