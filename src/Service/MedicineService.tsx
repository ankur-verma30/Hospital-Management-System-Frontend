import  axiosInstance  from "../Interceptor/AxiosInterceptor"

const addMedicine=async(data:any)=>{
    return axiosInstance.post("/pharmacy/medicines/add",data).then((response)=>response.data).catch((error)=>{throw error});
}

const getMedicine=async(id:number)=>{
    return axiosInstance.get("/pharmacy/medicines/get/"+id).then((response)=>response.data).catch((error)=>{throw error});
}

const getAllMedicine=async()=>{
    return axiosInstance.get("/pharmacy/medicines/get-all").then((response)=>response.data).catch((error)=>{throw error});
}


const updateMedicine=async(data:any)=>{
    return axiosInstance.put("/pharmacy/medicines/update",data).then((response)=>response.data).catch((error)=>{throw error});
}

export {addMedicine,getMedicine,getAllMedicine,updateMedicine};
