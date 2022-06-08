import db from "../models/index";
require('dotenv').config();
import _ from 'lodash'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHome = (limitInput) => {
    return new Promise(async(resolve, reject) => {
        try {
             let users = await db.User.findAll({
                 limit: limitInput,
                 where: {roleId: 'R2'},
                 order: [['createdAt', 'DESC']],
                 attributes:{
                     exclude: ['password']
                 },
                include: [
                    {model: db.allcodes, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    {model: db.allcodes, as: 'genderData', attributes: ['valueEn', 'valueVi']}
                ],
                raw: true,
                nest: true
             })
             resolve({
                 errCode: 0,
                 data: users
             })
        }catch(e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
      try{
           let doctors = await db.User.findAll({
               where: {roleId: 'R2'},
               attributes: {
                 exclude: ['password', 'image']
               },
           })
           resolve({
               errCode: 0,
               data: doctors
           })
      }catch(e){
          reject(e)
      }

  })
}

let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown','action', 'selectedPrice', 
    'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'note','specialtyId']
    
    let isValid = true
    let element = ''
    for(let i=0; i<arrFields.length; i++) {
        if(!inputData[arrFields[i]]){
            isValid = false;
            element = arrFields[i]
            break;
    }
}
    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async(resolve , reject) => {
        try{
           
            let checkObj = checkRequiredFields(inputData)

           if(checkObj.isValid === false){
               resolve({
                   errCode: 1,
                   errMessage: `Missing parameter: ${checkObj.element}`
               })
           }else {

               if(inputData.action === 'CREATE'){
                await db.markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })
               }else if(inputData.action === 'EDIT'){
                let doctorMarkdown = await db.markdown.findOne ({
                    where: {doctorId: inputData.doctorId},
                    raw: false
                })
               if(doctorMarkdown){
                doctorMarkdown.contentHTML= inputData.contentHTML;
                doctorMarkdown.contentMarkdown= inputData.contentMarkdown;
                doctorMarkdown.description= inputData.description;
                doctorMarkdown.updateAt = new Date();
                await doctorMarkdown.save();
               }
              
               }
              

               //update insert to doctor_infor table
               let doctorInfor = await db.doctor_infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                        
                    },
                    raw:false
               })
               if(doctorInfor){
                doctorInfor.doctorId= inputData.doctorId;
                doctorInfor.priceId= inputData.selectedPrice;
                doctorInfor.provinceId= inputData.selectedProvince;
                doctorInfor.paymentId= inputData.selectedPayment;

                doctorInfor.nameClinic= inputData.nameClinic;
                doctorInfor.addressClinic= inputData.addressClinic;
                doctorInfor.note= inputData.note;
                doctorInfor.specialtyId= inputData.specialtyId;
                doctorInfor.clinicId= inputData.clinicId;
                await doctorInfor.save();

               }else{
               await db.doctor_infor.create({
                doctorId: inputData.doctorId,
                priceId: inputData.selectedPrice,
                provinceId: inputData.selectedProvince,
                paymentId: inputData.selectedPayment,

                nameClinic: inputData.nameClinic,
                addressClinic: inputData.addressClinic,
                note: inputData.note,
                specialtyId: inputData.specialtyId,
                clinicId: inputData.clinicId
                })
               }
               resolve({
                   errCode: 0,
                   errMessage: 'Save info doctor succeed'
               })
           }
        }catch(e){
            reject(e)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
             if(!inputId) {
                 resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                 })
             }else{
                 let data = await db.User.findOne({
                     where: {
                         id: inputId
                     },
                     attributes:{
                        exclude: ['password']
                    },
                   include: [
                       {
                           model: db.markdown,
                           attributes:['description', 'contentHTML', 'contentMarkdown' ]
                        },
                        
                        {model: db.allcodes, as: 'positionData', attributes: ['valueEn', 'valueVi']},

                        {
                            model: db.doctor_infor,
                            attributes: {
                                exclude:['id', 'doctorId']
                            },

                            include: [
                                {model: db.allcodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                                {model: db.allcodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                                {model: db.allcodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
                            ]
                           
                         },
                      
                   ],
                   raw: false,
                   nest: true

                 })

                 if(data && data.image){
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                 }

                 if (!data) data = {};
                 resolve({
                     errCode: 0,
                     data: data
                 })
             }
        }catch(e) {
            reject(e)
        }
    })
}
let bulkSchedule = (data) => {
    return new Promise(async(resolve, reject) => {
        try{
           
            if(!data.arrSchedule || !data.doctorId || !data.formatedDate){
                resolve({ 
                    errCode: 1,
                    errMessage: 'Missing required param!'
                })
            }else {
                let schedule = data.arrSchedule
                if(schedule && schedule.length > 0){
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                     
                        return item
                    })
                }
               // get exiting
                let existing = await db.schedule.findAll(
                    {where: {doctorId: data.doctorId, date: data.formatedDate},
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                }
                           );
               
                 //compare  different
                    let toCreate = _.differenceWith(schedule, existing, (a,b) => {
                        return a.timeType === b.timeType && +a.date === +b.date
                    })
                   
                if (toCreate && toCreate.length > 0) {
                    await db.schedule.bulkCreate(toCreate)
                }
            
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
    
            }
           
        }catch(e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
     return new Promise(async(resolve, reject) => {
         try {
           if(!doctorId || !date){
               resolve({
                   errCode: 1,
                   errMessage: 'Missing required parameters'
               })
           }else{
               let dataSchedule = await db.schedule.findAll({
                   where: {
                       doctorId: doctorId, 
                       date: date,
                   },

                   include: [
                     
                     {model: db.allcodes, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']},

                     {model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName']},
                   
                ],
                raw: false,
                nest: true
                   
               })
               if(!dataSchedule) dataSchedule = [];

               resolve({
                   errCode: 0,
                   data: dataSchedule
               })
           }
         }catch(e){
             reject(e)
         }
     })
}

let getExtraInforDoctorById = (idInput) => {
    return new Promise (async(resolve, reject) => {
        try{
            if(!idInput){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }else {
                let data = await db.doctor_infor.findOne({
                    where: {
                        doctorId: idInput
                    }, 
                    attributes: {
                        exclude:['id', 'doctorId']
                    },

                    include: [
                        {model: db.allcodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                        {model: db.allcodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                        {model: db.allcodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
                    ],
                    raw: false,
                    nest: true
                })

                if(!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

let getProfileDoctorById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes:{
                       exclude: ['password']
                   },
                  include: [
                    {
                        model: db.markdown,
                        attributes:['description', 'contentHTML', 'contentMarkdown' ]
                     },
                       
                       {model: db.allcodes, as: 'positionData', attributes: ['valueEn', 'valueVi']},

                       {
                           model: db.doctor_infor,
                           attributes: {
                               exclude:['id', 'doctorId']
                           },

                           include: [
                               {model: db.allcodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                               {model: db.allcodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                               {model: db.allcodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
                           ]
                          
                        },
                     
                  ],
                  raw: false,
                  nest: true

                })

                if(data && data.image){
                   data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        }catch(e){
            reject(e)
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkSchedule: bulkSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
}