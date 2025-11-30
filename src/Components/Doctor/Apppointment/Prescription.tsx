import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Group,
  Modal,
  Text,
  TextInput,
} from "@mantine/core";
import { IconEye, IconMedicineSyrup, IconSearch } from "@tabler/icons-react";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";
import { getPrescripitonByPatientId } from "../../../Service/AppointmentService";
import { formatDate } from "../../../utility/DateUtility";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";

const Prescription = ({ appointment }: any) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState<any[]>([]);
  const [medicineData, setMedicineData] = useState<any[]>([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters: any = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    console.log("Patient Id ", appointment.patientId);
    getPrescripitonByPatientId(appointment?.patientId)
      .then((res) => {
        console.log("Prescription Details ", res);
        setData(res);
        console.log("Prescription Details after setting", data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [appointment?.patientId]);

  const handleMedicine = (medicine: any[]) => {
    open();
    setMedicineData(medicine);
  };
  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon
          onClick={() =>
            navigate("/doctor/appointments/" + rowData.appointmentId)
          }
        >
          <IconEye size={20} stroke={1.5} />
        </ActionIcon>
        <ActionIcon onClick={() => handleMedicine(rowData.medicines)}  color="red" >
          <IconMedicineSyrup size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    );
  };
  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-end items-center">
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

  const header = renderHeader();
  return (
    <div>
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
        globalFilterFields={["doctorName", "notes"]}
        emptyMessage="No Appointments found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column field="doctorName" header="Doctor" />

        <Column
          field="prescriptionDate"
          header="Prescription Date"
          sortable
          body={(rowData) => formatDate(rowData.prescriptionDate)}
        />

        <Column
          field="medicine"
          header="Medicines"
          body={(rowData) => rowData.medicines?.length ?? 0}
          style={{ minWidth: "14rem" }}
        />

        <Column
          field="notes"
          header="Additional Notes"
          style={{ minWidth: "14rem" }}
        />

        <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionBodyTemplate}
        />
      </DataTable>
      <Modal
        opened={opened}
        onClose={close}
        title="Medicines"
        size="xl"
        centered
      >
        {medicineData?.map((data, index) => (
          <Card key={index} shadow="md" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="lg">
                {data.name}
              </Text>
              <Badge color="blue" variant="light" size="lg">
                {data.type}
              </Badge>
            </Group>

            <Divider
              my="sm"
              
              label="Dosage Information"
              labelPosition="center"
            />

            <Group justify="space-between" mt="sm">
              <Text fw={500}>Dosage:</Text>
              <Text c="dimmed">{data.dosage}</Text>
            </Group>

            <Group justify="space-between" mt="xs">
              <Text fw={500}>Frequency:</Text>
              <Text c="dimmed">{data.frequency}</Text>
            </Group>

            <Group justify="space-between" mt="xs">
              <Text fw={500}>Duration:</Text>
              <Text c="dimmed">{data.duration} days</Text>
            </Group>

            <Group justify="space-between" mt="xs">
              <Text fw={500}>Route:</Text>
              <Text c="dimmed">{data.route}</Text>
            </Group>

            <Divider my="sm" label="Instructions" labelPosition="center" />

            <Text c="dimmed" mt="xs">
              {data.instructions}
            </Text>
          </Card>
        ))}
        {medicineData.length === 0 && (
          <Text color="dimmed" size="sm" mt="md">
            No medicines prescribed for this appartment
          </Text>
        )}
      </Modal>
    </div>
  );
};

export default Prescription;
