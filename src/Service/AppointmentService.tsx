import  axiosInstance  from "../Interceptor/AxiosInterceptor"

const scheduleAppointment=async(data:any)=>{
    return axiosInstance.post("/appointment/scheduled",data).then((response)=>response.data).catch((error)=>{throw error});
}

const cancelAppointment=async(id:number)=>{ 
    return axiosInstance.put("/appointment/cancel/"+id)
    .then((response)=>response.data)
    .catch((error)=>{throw error});
}

const getAppointment=async(id:number)=>{
    return axiosInstance.get("/appointment/get/"+id)
    .then((response)=>response.data)
    .catch((error)=>{throw error});
}

const getAppointmentDetails=async(id:number)=>{
    return axiosInstance.get("/appointment/get/details/"+id)
    .then((response)=>response.data)
    .catch((error)=>{throw error});
}

const getAllAppointmentByPatient=async(patientId:number)=>{
    return axiosInstance.get("/appointment/getAllByPatient/"+patientId)
    .then((response)=>response.data)
    .catch((error)=>{throw error});
}


const getAllAppointmentByDoctor=async(doctorId:number)=>{
    return axiosInstance.get("/appointment/getAllByDoctor/"+doctorId)
    .then((response)=>response.data)
    .catch((error)=>{throw error});
}

const createAppoointmentReport=(data:any)=>{
    return axiosInstance.post("/appointment/report/create",data)
    .then((response)=>response.data)
    .catch((error)=>{throw error});
} 

const isReportExists=async(appointmentId:number)=>{
    return axiosInstance.get("/appointment/report/isRecordExists/"+appointmentId)
    .then((response)=>response.data)
    .catch((error)=>{throw error});
}

const getRecordsByPatientId=async(patientId:number)=>{
    return axiosInstance.get("/appointment/report/getRecordsByPatientId/"+patientId)
    .then((response)=>response.data)
    .catch((error)=>{throw error});
}

const getPrescripitonByPatientId=async(patientId:number)=>{
    return axiosInstance.get("/appointment/report/getPrescriptionByPatientId/"+patientId)
    .then((response)=>response.data)
    .catch((error)=>{throw error});
}

export {scheduleAppointment,cancelAppointment,getAppointment,getAppointmentDetails,getAllAppointmentByPatient,getAllAppointmentByDoctor,createAppoointmentReport,isReportExists,getRecordsByPatientId,getPrescripitonByPatientId};