import {
  Button,
  Fieldset,
  NumberInput,
  Select,
  TextInput,
  ActionIcon,
  type SelectProps,
  Group,
  Badge,
} from "@mantine/core";
import { IconCheck, IconEdit, IconSearch } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
  errorNotification,
  successNotification,
} from "../../../utility/NotificationUtil";
import { useEffect, useState } from "react";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { addStock,updateStock,getAllStocks } from "../../../Service/InventoryService";
import { DateInput } from "@mantine/dates";
import { getAllMedicine } from "../../../Service/MedicineService";

const Inventory = () => {
  const [data, setData] = useState<any[]>([]);
  const [medicine,setMedicine]=useState<any[]>([]);
  const [medicineMap,setMedicineMap]=useState<Record<string,any>>({});
  const [edit, setEdit] = useState(false);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      id: null,
      medicineId: "",
      batchNo: "",
      quantity: 0,
      expiryDate: "",
    },
    validate: {
      medicineId: (value) => (!value ? "Medicine Required" : null),
      batchNo: (value) => (!value ? "Batch No Required" : null),
      quantity: (value) => (!value ? "Quantity Required" : null),
      expiryDate: (value) => (!value ? "Expiry Date Required" : null),
    },
  });

  const handleSubmit = (values: any) => {
    let method;
    let update = false;

    if (values.id) {
      method = updateStock;
      update = true;
    } else {
      method = addStock;
    }
    setLoading(true);
    method(values)
      .then((res) => {
        successNotification(
          `Stock ${update ? "Updated" : "Added"} Successfully`
        );
        form.reset();
        setEdit(false);
        fetchData();
      })
      .catch((error) => {
        errorNotification(
          error?.response?.data?.errorMessage ||
            `Error ${update ? "Updating" : "Adding"} Stock`
        );
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

  useEffect(() => {
     getAllMedicine()
      .then((res) => {
        setMedicine(res);
        setMedicineMap(res.reduce((acc:any,item:any)=>{
          acc[item.id]=item;
          return acc;  
        },{}))
      })
      .catch((error) => {
        console.log("Error fetching records", error);
      });
    fetchData();
  }, []);

  const fetchData = () => {
    getAllStocks()
      .then((res) => {
        setData(res);
      })
      .catch((error) => {
        console.log("Error fetching records", error);
      });
  };

  const onEdit = (rowData: any) => {
    setEdit(true);
    form.setValues({
      ...rowData,
      medicineId: ""+rowData.medicineId,
      batchNo: rowData.batchNo,
      quantity: rowData.quantity,
      expiryDate: new Date(rowData.expiryDate),
    });
  };

  const cancel = () => {
    setEdit(false);
    form.reset();
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon onClick={() => onEdit(rowData)}>
          <IconEdit size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    );
  };
  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <Button variant="filled" onClick={() => setEdit(true)}>
          Add Medicine
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

  const header = renderHeader();

const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }: any) => {
  return (
    <Group flex="1" gap="xs">
      <div className="flex gap-5 items-center">
        <span>{option.label}</span>
        {option?.manufacturer && (
          <span style={{ marginLeft: "auto", fontSize: "0.9rem", color: "gray"}}>
            {option.manufacturer}
          </span>
        )}
      </div>
      {checked && <IconCheck style={{ marginInlineStart: "auto" }} />}
    </Group>
  );
};


const statusBody=(rowData:any)=>{
const isExpired=new Date(rowData.expiryDate)<new Date();
return <Badge color={isExpired?"red":"green"}>{isExpired?"Expired":"Active"}</Badge>
}

  return (
    <div>
      {!edit ? (
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
          emptyMessage="No Stocks found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column field="name" header="Medicine"  body={(rowData) => <span>{medicineMap[""+rowData.medicineId]?.name} <span>({medicineMap[""+rowData.medicineId]?.manufacturer})</span></span>}/>

          <Column field="batchNo" header="Batch No." />

          <Column
            field="initialQuantity"
            header="Quantity"
          />

          <Column
            field="quantity"
            header="Remaining Quantity"
          />

          <Column
            field="expiryDate"
            header="Expiry Date"
            
          />
        <Column 
        field="status"
        header="Status"
        body={statusBody}
        />

          <Column
            headerStyle={{ width: "5rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={actionBodyTemplate}
          ></Column>

        </DataTable>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)} className="grid gap-5">
          <Fieldset
            className="grid grid-cols-2 gap-4"
            legend={
              <span className="text-lg font-medium  text-primary-500">
                Medicine Information
              </span>
            }
            radius="md"
          >
            <Select
              withAsterisk
              renderOption={renderSelectOption}
              {...form.getInputProps("medicineId")}
              label="Medicine ID"
              placeholder="Select Medicine ID"
              data={medicine.map((med)=>({
                ...med,
                value:""+med.id,
                label:med.name
              }))}
            />

            <TextInput
              withAsterisk
              {...form.getInputProps("batchNo")}
              label="Batch No."
              placeholder="Enter Batch Number"
            />
            <NumberInput
              withAsterisk
              {...form.getInputProps("quantity")}
              min={0}
              clampBehavior="strict"
              label="Quantity"
              placeholder="Enter Quantity"
            />

            <DateInput 
              withAsterisk
              {...form.getInputProps("expiryDate")}
              label="Expiry Date"
              placeholder="Enter Expiry Date"
              minDate={new Date()}
            />

          </Fieldset>

          <div className="flex items-center gap-5 justify-center">
            <Button
              loading={loading}
              type="submit"
              className="w-full"
              variant="filled"
              color="primary"
            >
              {form.values?.id ? "Update" : "Add"} Stock
            </Button>
            <Button
              loading={loading}
              variant="filled"
              color="red"
              onClick={cancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Inventory;
