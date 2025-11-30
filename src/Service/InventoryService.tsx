import  axiosInstance  from "../Interceptor/AxiosInterceptor"

const addStock=async(data:any)=>{
    return axiosInstance.post("/pharmacy/inventory/add",data).then((response)=>response.data).catch((error)=>{throw error});
}

const updateStock=async(data:any)=>{
    return axiosInstance.put("/pharmacy/inventory/update",data).then((response)=>response.data).catch((error)=>{throw error});
}

const getAllStocks=async()=>{
    return axiosInstance.get("/pharmacy/inventory/getAll").then((response)=>response.data).catch((error)=>{throw error});
}

const getStock=async(id:number)=>{
    return axiosInstance.get("/pharmacy/inventory/get/"+id).then((response)=>response.data).catch((error)=>{throw error});
}



export {addStock,updateStock,getAllStocks,getStock};