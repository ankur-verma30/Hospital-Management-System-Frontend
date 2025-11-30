import { Button, Fieldset, NumberInput, Select, TextInput, ActionIcon } from '@mantine/core';
import {  medicineCategories, medicineForms } from "../../../Data/DropDownData"
import {  IconEdit, IconSearch } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { errorNotification, successNotification } from '../../../utility/NotificationUtil';
import {  useEffect, useState } from 'react';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { addMedicine, getAllMedicine,updateMedicine } from '../../../Service/MedicineService';
import { capitalize } from '../../../utility/OtherUtitlity';


type Medicine={
  name:string,
  dosage:string,
  frequency:string,
  medicineId?:number,
  duration:number,
  route:string,
  type:string,
  instructions:string,
  prescriptionId:number
}

const Medicine = () => {
  const [data,setData]=useState<any[]>([]);
  const [edit,setEdit]=useState(false);
   const [filters, setFilters] = useState<DataTableFilterMeta>({
         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
       });
  
      const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [loading,setLoading]=useState(false)
  const form=useForm({
    initialValues:{
        id:null,
      name:"",
      dosage:"",
      category:"",
      type:"",
      manufacturer:"",
      unitPrice:0,
    },
    validate:{
        name: (value) => (!value ? "Name Required" : null),
        dosage: (value) => (!value ? "Dosage Required" : null),
        category: (value) => (!value ? "Category Required" : null),
        type: (value) => (!value ? "Type Required" : null),
        manufacturer: (value) => (!value ? "Manufacturer Required" : null),
        unitPrice: (value) => (!value ? "Unit Price Required" : null)
    }
  })

const handleSubmit = (values: any) => {
  let method;
  let update = false; 

  if (values.id) {
    method = updateMedicine;
    update = true;
  } else {
    method = addMedicine;
  }
  setLoading(true);
  method(values)
    .then((res) => {
      successNotification(`Medicine ${update ? "Updated" : "Added"} Successfully`);
      form.reset();
      setEdit(false);
      fetchData();
    })
    .catch((error) => {
      errorNotification(error?.response?.data?.errorMessage || `Error ${update ? "Updating" : "Adding"} Medicine`);
    })
    .finally(() => {
      setLoading(false);
    });
};

 const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters: any = { ...filters };
        _filters["global"].value = value;
    
        setFilters(_filters);
        setGlobalFilterValue(value);
      };


  useEffect(()=>{
    fetchData();
  },[])

  const fetchData=()=>{
    getAllMedicine().then((res)=>{
      setData(res);
    }).catch((error)=>{
      console.log("Error fetching records",error);})    
    }
    
    const onEdit=(rowData:any)=>{
        setEdit(true);
        form.setValues({
            ...rowData,
            name:rowData.name,
            dosage:rowData.dosage,
            category:rowData.category,
            type:rowData.type,
            manufacturer:rowData.manufacturer,
            unitPrice:rowData.unitPrice
        });
    }

    const cancel=()=>{
        setEdit(false);
        form.reset();
    }

  const actionBodyTemplate = (rowData:any) => {
    return(
      <div className="flex gap-2">
        <ActionIcon onClick={()=>onEdit(rowData)}>
        <IconEdit size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    )
  };
        const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <Button variant='filled' onClick={()=>setEdit(true)}>Add Medicine</Button>
        <TextInput
          leftSection={<IconSearch  />}
          fw={500}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </div>
    );
  };

  const header=renderHeader();

  return (
    <div>
      {
        !edit ? (
          <DataTable
                header={header}
                value={data}
                paginator
                stripedRows
                size="small"
                rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                dataKey="id"
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={[
                  "doctorName",
                  "notes",
                 
                ]}
                emptyMessage="No Medicines found."
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              >
               
                <Column
                  field="name"
                  header="Medicine Name"
                  
                  
                />

                <Column
                  field="dosage"
                  header="Dosage"
                  
                />

                <Column
                  field="category"
                  header="Category"
                  body={rowData => capitalize(rowData.category)}
                  
                />

                <Column
                  field="type"
                  header="Type"
                  body={rowData => capitalize(rowData.type)}
                />

                <Column
                  field="manufacturer"
                  header="Manufacturer"
                body={rowData => capitalize(rowData.manufacturer)}
                />

                <Column
                field='stock'
                header='Stock'
                />

                <Column
                  field="unitPrice"
                  header="Unit Price (Rs.)"
                  sortable
                />

                  <Column headerStyle={{width:'5rem',textAlign:'center'}} 
            bodyStyle={{textAlign:'center', overflow:'visible'}}
            body={actionBodyTemplate} ></Column>

              </DataTable>
            
          
        ) :
        (
    <form onSubmit={form.onSubmit(handleSubmit)} className='grid gap-5'>
        <Fieldset className='grid grid-cols-2 gap-4' legend={<span className="text-lg font-medium  text-primary-500">Medicine Information</span>} radius="md">

        <TextInput
        withAsterisk
        {...form.getInputProps('name')}
        label="Medicine Name"
        placeholder="Enter Medicine Name"

        />

        <TextInput
        withAsterisk
        {...form.getInputProps('dosage')}
        label="Dosage"
        placeholder="Enter Dosage (50mg ,50ml ,1gm etc)"
        />

        <Select
        withAsterisk
        {...form.getInputProps('category')}
        label="Category"
        placeholder="Select Category"
        data={medicineCategories}
        />

        <Select
        withAsterisk
        {...form.getInputProps('type')}
        label="Type"
        placeholder="Select type"
        data={medicineForms}
        />

        <TextInput
        withAsterisk
        {...form.getInputProps('manufacturer')}
        label="Manufacturer"
        placeholder="Enter Manufacturer"
        />
      
        <NumberInput
        withAsterisk
        {...form.getInputProps('unitPrice')}
        min={0}
        clampBehavior='strict'
        label="Unit Price"
        placeholder="Enter Unit Price"
        />
        
        </Fieldset>
      
        <div className='flex items-center gap-5 justify-center'>
          <Button loading={loading} type='submit' className='w-full' variant='filled' color='primary'>{form.values?.id ? 'Update' : 'Add'} Medicine</Button>
          <Button loading={loading} variant='filled' color='red' onClick={cancel}>Cancel</Button>
        </div>
    </form>
        )
      }

    </div>
  )
}

export default Medicine