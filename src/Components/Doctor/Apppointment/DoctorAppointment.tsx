import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import type { DataTableFilterMeta } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { ActionIcon, LoadingOverlay, Modal, SegmentedControl, Select, Textarea, TextInput } from "@mantine/core";
import {  IconEye, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getDoctorDropdown } from "../../../Service/DoctorProfileService";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { visitReasons } from "../../../Data/DropDownData";
import { useSelector } from "react-redux";
import { cancelAppointment, getAllAppointmentByDoctor, scheduleAppointment } from "../../../Service/AppointmentService";
import { errorNotification, successNotification } from "../../../utility/NotificationUtil";
import { formatDateWithTime } from "../../../utility/DateUtility";
import { modals } from "@mantine/modals";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { useNavigate } from "react-router-dom";


const DoctorAppointment = () => {
  const [tab,setTab]=useState<string>("Today");
  const [opened, { open, close }] = useDisclosure(false);
  const [appointments,setAppointments]=useState([]);
  const [loading,setLoading]=useState(false);
  const user=useSelector((state:any)=> state.user);
  const [doctors, setDoctors] = useState([]);
  const navigate=useNavigate();

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    reason: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    status: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    notes: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");



  const getSeverity = (status: string) => {
    switch (status) {
      case "CANCELLED":
        return "danger";

      case "COMPLETED":
        return "success";

      case "SCHEDULED":
        return "info";
      default:
        return null;
    }
  };

  useEffect(() => {
  
   fetchData();
    getDoctorDropdown()
      .then((data) => {
        console.log(data);
        setDoctors(
          data.map((doctor: any) => ({
            value: "" + doctor.id,
            label: doctor.name,
          }))
        );
      })
      .catch((err) => {
        console.log("Error fetching doctors", err);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters: any = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const form = useForm({
    initialValues: {
      patientId: "",
      doctorId: user.profileId,
      appointmentTime: new Date(),
      reason: "",
      notes: "",
    },
    validate: {
      doctorId: (value) => (value ? null : "Doctor is required"),
      patientId: (value) => (value ? null : "Patient is required"),
      appointmentTime: (value) =>
        value ? null : "Appointment Time is required",
      reason: (value) => (value ? null : "Reason for appointment is required"),
    },
  });

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <Button leftSection={<IconPlus />} onClick={open} variant="filled">
          Schedule Appointment
        </Button>
        <TextInput
          leftSection={<IconSearch />}
          fw={500}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </div>
    );
  };

  const fetchData=()=>{
       getAllAppointmentByDoctor(user.profileId)
      .then((data) => {
        console.log(data);
        setAppointments(data);
      })
      .catch((err) => {
        console.log("Error fetching appointments", err);
      });
  }
  const statusBodyTemplate = (rowData: Customer) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };


  const handleDelete=(rowData:any)=>{
    modals.openConfirmModal({
      title:<span className="text-xl font-serif font-semibold">Cancel Appointment</span>,
      centered: true,
      children:"Are you sure you want to cancel this appointment?",
      labels:{confirm:"Delete",cancel:"Cancel"},
      onConfirm:()=>{
        cancelAppointment(rowData.id).then((res)=>{
          successNotification("Appointment Cancelled Successfully");
          setAppointments(appointments.filter((item:any)=>item.id===rowData.id ? {...appointments,status:"CANCELLED"} : appointments));
        }).catch((error)=>{
          console.log("Error canceling appointment",error);
          errorNotification(error.response.data.errorMessage || "Error canceling appointment");
        })
      },
    })
  }

  const actionBodyTemplate = (rowData:any) => {
    return(
      <div className="flex gap-2">
        <ActionIcon onClick={()=>navigate(""+rowData.id)}>
          <IconEye size={20} stroke={1.5} />
          </ActionIcon>
          <ActionIcon color="red" onClick={()=>handleDelete(rowData)}>
          <IconTrash size={20} stroke={1.5} />
          </ActionIcon>
      </div>
    )
  };

  const timeTemplate=(rowData:any)=>{
    return <span>{formatDateWithTime(rowData.appointmentTime)}</span>
  }

  const handleSubmit=(values:any)=>{
    console.log("Appointment schedule details",values);
  setLoading(true);
  scheduleAppointment(values).then((res)=>{

      close();
      form.reset();
      fetchData();
      successNotification("Appointment Scheduled Successfully");
  }).catch((error)=>{
    console.log("Error scheduling appointment",error);
    errorNotification(error.response.data.errorMessage || "Error scheduling appointment");
  }).finally(()=>{
    setLoading(false);
  })

  }

  const leftToolbarTemplate = () => {
    return (
        <Button leftSection={<IconPlus />} onClick={open} variant="filled">
          Schedule Appointment
        </Button>
      
    );
  };

  const startToolbarTemplate = () => {
    return (
      <SegmentedControl
        value={tab}
        onChange={setTab}
        variant="filled"
        color={tab === "Past" ? "red" : tab === "Today" ? "blue" : "green"}

        data={["Past", "Today", "Upcoming"]}
      />
    );
  };

  const rightToolbarTemplate = () => {
    return (
     <TextInput
          leftSection={<IconSearch />}
          fw={500}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
    );
  };
  const filteredAppointment= appointments.filter((appointment)=>{
    const appointmentDate=new Date(appointment.
appointmentTime
);
    const today=new Date();
    today.setHours(0,0,0,0);

    const appointmentDay=new Date(appointmentDate);
    appointmentDay.setHours(0,0,0,0);
    if(tab==="Past"){
      return appointmentDay.getTime()<today.getTime();
    }else if(tab==="Today"){
      return appointmentDay.getTime()===today.getTime();
    }else{
      return appointmentDay.getTime()>today.getTime();
    }
    return true;
  })
  return (
    <div className="card">
      <Toolbar className="mb-4"  start={startToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
      <DataTable
        value={filteredAppointment}
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
          "patientName",
          "reason",
          "notes",
          "status",
        ]}
        emptyMessage="No Appointments found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
       
        <Column
          field="patientName"
          header="Patient"
          sortable
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "14rem" }}
        />

        <Column
          field="patientPhone"
          header="Phone Number"
          style={{ minWidth: "14rem" }}
        />

        <Column
          field="appointmentTime"
          header="Appointment Time"
          sortable
          style={{ minWidth: "14rem" }}
          body={timeTemplate}
        />

             <Column
          field="reason"
          header="Reason"
          sortable
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "14rem" }}
        />

             <Column
          field="notes"
          header="Additional Notes"
          sortable
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "14rem" }}
        />

        <Column
          field="status"
          header="Status"
          sortable
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          body={statusBodyTemplate}
          filter
        />
      
        <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionBodyTemplate}
        />
      </DataTable>
      <Modal
        opened={opened}
        size="md"
        onClose={close}
        title={
          <div className="font-xl font-semibold ">Schedule Appointment</div>
        }
        centered
      >
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{radius:'sm', blur:2}} />
        <form onSubmit={form.onSubmit(handleSubmit)} className="grid grid-cols-1 gap-5">
          <Select
            {...form.getInputProps("doctorId")}
            data={doctors}
            label="Doctor"
            placeholder="Select Doctor"
            withAsterisk
          />
          <DateTimePicker
          minDate={new Date()}
            {...form.getInputProps("appointmentTime")}
            label="Appointment Time"
            placeholder="Pick appointment date and time"
            withAsterisk
          />
          <Select
            {...form.getInputProps("reason")}
            data={visitReasons}
            label="Reason"
            placeholder="Reason for Appointment"
            withAsterisk
          />
          <Textarea
            {...form.getInputProps("notes")}
            label="Additional Notes"
            placeholder="Enter any Additional Notes"
          />
          <Button type="submit" variant="filled">
            Schedule
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorAppointment;
