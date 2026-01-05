import  axiosInstance  from "../Interceptor/AxiosInterceptor"

// Add a base url to remove redundancy

const addSales=async(data:any)=>{
    return axiosInstance.post("/pharmacy/sales/create",data).then((response)=>response.data).catch((error)=>{throw error});
}

const getSales=async(id:number)=>{
    return axiosInstance.get("/pharmacy/sales/get/"+id).then((response)=>response.data).catch((error)=>{throw error});
}

const getAllSaleItems=async(id:number)=>{
    return axiosInstance.get("/pharmacy/sales/getSaleItems/"+id).then((response)=>response.data).catch((error)=>{throw error});
}


const updateSales=async(data:any)=>{
    return axiosInstance.put("/pharmacy/sales/update",data).then((response)=>response.data).catch((error)=>{throw error});
}

const getAllSales=async()=>{
    return axiosInstance.get("/pharmacy/sales/getAll").then((response)=>response.data).catch((error)=>{throw error});
}

export {addSales,getSales,getAllSaleItems,updateSales,getAllSales};
