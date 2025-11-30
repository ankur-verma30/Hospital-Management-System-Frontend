import { ActionIcon, Button, Fieldset, MultiSelect, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { dosageFrequency, symptoms, tests } from "../../../Data/DropDownData"
import { IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { createAppoointmentReport, getRecordsByPatientId, isReportExists } from '../../../Service/AppointmentService';
import { errorNotification, successNotification } from '../../../utility/NotificationUtil';
import { useEffect, useState } from 'react';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatDate } from '../../../utility/DateUtility';
import { FilterMatchMode } from 'primereact/api';
import { useNavigate } from 'react-router-dom';


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
const ApReport = ({appointment}:any) => {
  const [data,setData]=useState<any[]>([]);
  const [allowAdd,setAllowAdd]=useState(false);
  const [edit,setEdit]=useState(false);
   const [filters, setFilters] = useState<DataTableFilterMeta>({
         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
       });
  
      const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const navigate=useNavigate();
  const [loading,setLoading]=useState(false)
  const form=useForm({
    initialValues:{
      symptoms:[],
      tests:[],
      diagnosis:"",
      notes:"",
      referral:"",
      prescription:{
        notes:"",
        medicines:[
      ] as Medicine[]

    }
  },
  validate:{
    symptoms: (value) => (!value.length ? "Please slect at least one symptom" : null),
    diagnosis: (value) => (!value.trim() ? "Diagnosis Required" : null),
    prescription:{
     medicines:{
      name: (value) => (!value.trim() ? "Medicine Name Required" : null),
      dosage: (value) => (!value.trim() ? "Dosage Required" : null),
      frequency: (value) => (!value.trim() ? "Frequency Required" : null),
      duration: (value) => (!value ? "Duration Required" : null),
      route: (value) => (!value.trim() ? "Route Required" : null),
      type: (value) => (!value.trim() ? "Type Required" : null),
      instructions: (value) => (!value.trim() ? "Instructions Required" : null),
     }
    }
  }
  })

  const insertMedicine=()=>{
    form.insertListItem("prescription.medicines",{name:"" ,dosage:"" ,frequency:""  ,duration:0 ,route:"" ,type:"" ,instructions:""})
  }

  const removeMedicine=(index:number)=>{
    form.removeListItem("prescription.medicines",index)
  }

  const handleSubmit=(values:typeof form.values)=>{
const data={...values,
  doctorId:appointment.doctorId,
  patientId:appointment.patientId,
  appointmentId:appointment.id,
  prescription:{
    ...values.prescription,
    doctorId:appointment.doctorId,
  patientId:appointment.patientId,
  appointmentId:appointment.id,
  }
}
setLoading(true);
 createAppoointmentReport(data).then((res)=>{
  successNotification("Report submitted successfully");
  form.reset();
  setEdit(false);
  setAllowAdd(false);
  fetchData();

 }).catch((error)=>{
  errorNotification( error?.response?.data?.errorMessage ||"Error submitting report");
 }).finally(()=>{
  setLoading(false);
 })
  }

 const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters: any = { ...filters };
        _filters["global"].value = value;
    
        setFilters(_filters);
        setGlobalFilterValue(value);
      };

  useEffect(()=>{
    fetchData();
  },[appointment.id, appointment?.patientId])

  const fetchData=()=>{
    getRecordsByPatientId(appointment?.patientId).then((res)=>{
      setData(res);
    }).catch((error)=>{
      console.log("Error fetching records",error);})

    isReportExists(appointment.id).then((res)=>{
      setAllowAdd(!res);
          }).catch((error)=>{
      console.log("Error checking report exists",error);
      setAllowAdd(true);
      
    })
  }

  const actionBodyTemplate = (rowData:any) => {
    return(
      <div className="flex gap-2">
      </div>
    )
  };
        const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-between items-center">
        {allowAdd && <Button variant='filled' onClick={()=>setEdit(true)}>Add Report</Button>}
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
                emptyMessage="No Appointments found."
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              >
               
                <Column
                  field="doctorName"
                  header="Doctor"
                  
                />

                <Column
                field='diagnosis'
                header='Diagnosis'
                  
                />
        
                <Column
                  field="reportDate"
                  header="Report Date"
                  sortable
                  body={(rowData)=>formatDate(rowData.createdAt )}
                />

                     <Column
                  field="notes"
                  header="Additional Notes"
                 
                />

                 <Column
                          headerStyle={{ width: "5rem", textAlign: "center" }}
                          bodyStyle={{ textAlign: "center", overflow: "visible" }}
                          body={actionBodyTemplate}
                        />
              </DataTable>
        ) :
        (
    <form onSubmit={form.onSubmit(handleSubmit)} className='grid gap-5'>
        <Fieldset className='grid grid-cols-2 gap-4' legend={<span className="text-lg font-medium  text-primary-500">Personal Information</span>} radius="md">

        <MultiSelect className='col-span-2' withAsterisk
         label="Symptoms"
         {...form.getInputProps('symptoms')}
        placeholder="Pick Symptoms"
        data={symptoms}
        />

         <MultiSelect className='col-span-2' 
         label="Tests"
        placeholder="Pick tests"
        {...form.getInputProps('tests')}
        data={tests}
        />

        <TextInput
        withAsterisk
        {...form.getInputProps('diagnosis')}
        label="Diagnosis"
        placeholder="Enter Diagnosis"

        />

            <TextInput
        label="Referral"
        {...form.getInputProps('referral')}
        placeholder="Enter Referral"
        />

        <Textarea className='col-span-2' label="Notes" 
        {...form.getInputProps('notes')}
        placeholder="Enter any Notes" /> 
        
        </Fieldset>

         <Fieldset className='grid  gap-5' legend={<span className="text-lg font-medium  text-primary-500">Prescription</span>} radius="md">
       
        
        <Textarea className='col-span-2' label="Notes" 
        {...form.getInputProps('prescription.notes')}
        placeholder="Enter any Notes" /> 
        
       {
        form.values.prescription.medicines.map((_medicine:Medicine,index:number)=>(
        <div className='grid gap-4 col-span-2 grid-cols-2'>

          <div className=' flex col-span-2 items-center justify-between'>
            <h1 className='text-lg font-medium'>Medicine {index+1}</h1>
            <ActionIcon variant='filled' color='red' size="lg" className='mb-2'>
              <IconTrash onClick={()=>removeMedicine(index)} size={20} stroke={1.5}  />
            </ActionIcon>
          </div>
        <TextInput
        {...form.getInputProps(`prescription.medicines.${index}.name`)}
        withAsterisk
        label="Medicine"
        placeholder="Enter Medicine"
        />

        <TextInput
        {...form.getInputProps(`prescription.medicines.${index}.dosage`)}
         label="Dosage" placeholder="Select Dosage" withAsterisk/>

            <Select
        withAsterisk
        label="Frequency"
        {...form.getInputProps(`prescription.medicines.${index}.frequency`)}
        placeholder="Enter Frequency"
        data={dosageFrequency}
        />

      <NumberInput
        withAsterisk
        label="Duration (days)"
        {...form.getInputProps(`prescription.medicines.${index}.duration`)}
        placeholder="Enter Duration in days"
        min={1}
        max={30}
        />

        <Select label="Route" placeholder="Select Route" 
        {...form.getInputProps(`prescription.medicines.${index}.route`)}
        withAsterisk data={["Oral","Inhalation","Intravenous","Topical"]}/>

        <Select label="Type" placeholder="Select type" 
        {...form.getInputProps(`prescription.medicines.${index}.type`)}
        withAsterisk data={["Tablet","Capsule","Syrup","Injection"]}/>

        <TextInput
        withAsterisk
        label="Instructions"
        {...form.getInputProps(`prescription.medicines.${index}.instructions`)}
        placeholder="Enter Instructions"
        />
        </div>
        ))
       }

      <div className='flex  gap-2 items-center'>
       <span className='text-lg font-medium'>Add Medicines</span>
          <ActionIcon variant='filled' color='green' size="lg" onClick={insertMedicine}>
              <IconPlus size={20} stroke={1.5}  />
            </ActionIcon>
      </div>
        </Fieldset>
        <div className='flex items-center gap-5 justify-center'>
          <Button loading={loading} type='submit' className='w-full' variant='filled' color='primary'>Submit Report</Button>
          <Button loading={loading} variant='filled' color='red'>Cancel</Button>
        </div>
    </form>
        )
      }

    </div>
  )
}

export default ApReport