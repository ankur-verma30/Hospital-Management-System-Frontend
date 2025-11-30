import  axiosInstance  from "../Interceptor/AxiosInterceptor"

const getPatient=async(id:number)=>{
    return axiosInstance.get(`/profile/patient/get/${id}`)
    .then((response:any)=>response.data).catch((error:any)=>{throw error});
}

const updatePatient=async(patient:any)=>{
     console.log("API Call Payload:", patient);
    return await axiosInstance.put("/profile/patient/update",patient)
    .then((response:any)=>response.data).catch((error:any)=>{throw error;});
}

export {getPatient,updatePatient};