import  axiosInstance  from "../Interceptor/AxiosInterceptor"

const addSales=async(data:any)=>{
    return axiosInstance.post("/pharmacy/Sales/create",data).then((response)=>response.data).catch((error)=>{throw error});
}

const getSales=async(id:number)=>{
    return axiosInstance.get("/pharmacy/Sales/get/"+id).then((response)=>response.data).catch((error)=>{throw error});
}

const getAllSaleItems=async(id:number)=>{
    return axiosInstance.get("/pharmacy/getSaleItems/"+id).then((response)=>response.data).catch((error)=>{throw error});
}


const updateSales=async(data:any)=>{
    return axiosInstance.put("/pharmacy/Sales/update",data).then((response)=>response.data).catch((error)=>{throw error});
}

export {addSales,getSales,getAllSaleItems,updateSales};
