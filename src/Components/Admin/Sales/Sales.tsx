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
    LoadingOverlay,
    Divider,
    Text,
    Card,
    Modal,
    Title,
} from "@mantine/core";
import { IconCheck, IconEdit, IconEye, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { Fragment, useEffect, useState } from "react";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { getAllMedicine } from "../../../Service/MedicineService";
import { addSales, getAllSaleItems, getAllSales } from "../../../Service/SalesService";
import { errorNotification, successNotification } from "../../../utility/NotificationUtil";
import { formatDate } from "../../../utility/DateUtility";
import { useDisclosure } from "@mantine/hooks";

interface SaleItem {
    medicineId: string;
    quantity: number;
}
const Sales = () => {
    const [data, setData] = useState<any[]>([]);
    const [medicine, setMedicine] = useState<any[]>([]);
    const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});
    const [edit, setEdit] = useState(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [opened, { open, close }] = useDisclosure(false);
    const [saleItems, setSaleItems] = useState<any[]>([]);


    const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const form = useForm({
        initialValues: {
            buyerName: "",
            buyerContact: "",
            saleItems: [
                { medicineId: "", quantity: 0 },
            ] as SaleItem[],
        },
        validate: {
            saleItems: {
                medicineId: (value) => (!value ? "Medicine Required" : null),
                quantity: (value) => (!value ? "Quantity Required" : null),
            }
        },
    });

    const handleSubmit = (values: any) => {
        // let update=false;
        const saleItems = values.saleItems.map((x: any) => ({ ...x, unitPrice: medicineMap[x.medicineId]?.unitPrice }));
        const totalAmount = saleItems.reduce((acc: any, x: any) => acc + x.unitPrice * x.quantity, 0);
        console.log("Sales", values);
        setLoading(true);
        addSales({ ...values, saleItems, totalAmount })
            .then((_res) => {
                successNotification(
                    `Medicine sold successfully`
                );
                form.reset();
                setEdit(false);
                fetchData();
            })
            .catch((error) => {
                errorNotification(
                    error?.response?.data?.errorMessage ||
                    `Failed to sell medicine`
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
                console.log(res);
                setMedicine(res);
                setMedicineMap(res.reduce((acc: any, item: any) => {
                    acc[item.id] = item;
                    return acc;
                }, {}))
            })
            .catch((error) => {
                console.log("Error fetching records", error);
            });
        fetchData();
    }, []);

    const fetchData = () => {
        getAllSales()
            .then((res) => {
                console.log("Sales Data", res);
                setData(res);
            })
            .catch((error) => {
                console.log("Error fetching records", error);
            });
    };

    const handleDetails = (rowData: any) => {
        open();
        setLoading(true);
        getAllSaleItems(rowData.id).then((res) => {
            setSaleItems(res);
        }).catch((error) => {
            console.log("Error fetching records", error);
        })
            .finally(() => {
                setLoading(false);
            })
    }

    const onEdit = (rowData: any) => {
        setEdit(true);
        form.setValues({
            ...rowData,
            medicineId: "" + rowData.medicineId,
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
                <ActionIcon onClick={() => handleDetails(rowData)}>
                    <IconEye size={20} stroke={1.5} />
                </ActionIcon>
            </div>
        );
    };
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-between items-center">
                <Button variant="filled" onClick={() => setEdit(true)}>
                    Sell Medicine
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
                        <span style={{ marginLeft: "auto", fontSize: "0.9rem", color: "gray" }}>
                            {option.manufacturer} - {option.dosage}
                        </span>
                    )}
                </div>
                {checked && <IconCheck style={{ marginInlineStart: "auto" }} />}
            </Group>
        );
    };


    // const statusBody = (rowData: any) => {
    //     const isExpired = new Date(rowData.expiryDate) < new Date();
    //     return <Badge color={isExpired ? "red" : "green"}>{isExpired ? "Expired" : "Active"}</Badge>
    // }

    const addMoreMedicine = () => {
        form.insertListItem('saleItems', { medicineId: "", quantity: 0 });
    }

    return (
        <div>
            {!edit ? (
                <DataTable
                    removableSort
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
                    <Column field="buyerName" header="Buyer" />

                    <Column field="buyerContact" header="Contact" />

                    {/* <Column
                        field="prescriptionId"
                        header="Prescription ID"
                    /> */}

                    <Column
                        field="totalAmount"
                        header="Total Amount"
                        sortable

                    />

                    <Column
                        field="saleDate"
                        header="Sale Date"
                        body={(rowData: any) => formatDate(rowData.saleDate)}
                        sortable

                    />

                    <Column
                        headerStyle={{ width: "5rem", textAlign: "center" }}
                        bodyStyle={{ textAlign: "center", overflow: "visible" }}
                        body={actionBodyTemplate}
                    ></Column>

                </DataTable>
            ) : (
                <form onSubmit={form.onSubmit(handleSubmit)} className="grid gap-5">
                    <LoadingOverlay visible={loading} />
                    <Fieldset className="grid gap-5"
                        legend={
                            <span className="text-lg font-medium  text-primary-500">
                                Buyer Information
                            </span>
                        }
                        radius="md"
                    >
                        <div className="grid grid-cols-2 gap-5">
                            <TextInput withAsterisk label="Buyer Name" {...form.getInputProps("buyerName")} />
                            <NumberInput hideControls maxLength={10} withAsterisk label="Contact Details" {...form.getInputProps("buyerContact")} />
                        </div>
                    </Fieldset>
                    <Fieldset className="grid gap-5"
                        legend={
                            <span className="text-lg font-medium  text-primary-500">
                                Medicine Information
                            </span>
                        }
                        radius="md"
                    >
                        <div className="grid grid-cols-5 gap-4">
                            {form.values.saleItems.map((item: any, index: number) => (
                                <Fragment key={index}>
                                    <div className="col-span-2">
                                        <Select
                                            withAsterisk
                                            renderOption={renderSelectOption}
                                            {...form.getInputProps(`saleItems.${index}.medicineId`)}
                                            label="Medicine ID"
                                            placeholder="Select Medicine ID"
                                            //arr[0].name  and arr.0.name two ways
                                            data={medicine.filter(x => !form.values.saleItems.some((item1: any, idx) => item1.medicineId == x.id &&
                                                idx != index)).map((med) => ({
                                                    ...med,
                                                    value: "" + med.id,
                                                    label: med.name
                                                }))}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <NumberInput
                                            rightSectionWidth={80}
                                            rightSection={
                                                <div className="text-xs text-white font-medium flex gap-1 bg-red-400 p-2 rounded-md"> Stock: {medicineMap[item.medicineId]?.stock || 0}</div>
                                            }
                                            withAsterisk
                                            {...form.getInputProps(`saleItems.${index}.quantity`)}
                                            min={0}
                                            clampBehavior="strict"
                                            label="Quantity"
                                            placeholder="Enter Quantity"
                                            max={medicineMap[item.medicineId]?.stock || 0}
                                        />
                                    </div>
                                    <div className="flex items-end justify-between">
                                        {(item.quantity > 0 && item.medicineId) ? <div><span className="text-lg">Total :</span>{item.quantity} X {medicineMap[item.medicineId]?.unitPrice} = {item.quantity * medicineMap[item.medicineId]?.unitPrice}</div>
                                            : <div></div>}
                                        <ActionIcon size="lg" color="red" onClick={() => form.removeListItem('saleItems', index)}>
                                            <IconTrash size={20} stroke={1.5} />
                                        </ActionIcon>
                                    </div>
                                </Fragment>

                            ))}
                        </div>
                        <div className="flex items-center justify-center">
                            <Button onClick={addMoreMedicine} variant="outline" leftSection={<IconPlus size={16} />}>Add more </Button>
                        </div>


                    </Fieldset>

                    <div className="flex items-center gap-5 justify-center">
                        <Button
                            loading={loading}
                            type="submit"
                            className="w-full"
                            variant="filled"
                            color="primary"
                        >
                            Sell Medicine
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
            <Modal
                opened={opened}
                onClose={close}
                title="Sold Medicines"
                size="xl"
                centered
            >
                {saleItems?.map((data, index) => (
                    console.log("data", data),
                    <Card key={index} shadow="md" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="sm">
                            <Title order={4} mb="sm">
                                {medicineMap[data.medicineId]?.name}{`(${medicineMap[data.medicineId]?.dosage})`} -     <span className="text-gray-700">{medicineMap[data.medicineId]?.manufacturer}</span>
                            </Title>
                            </Group>
                            <Group>
                                
                                    <Text fw={600} size="sm" color="black">
                                Batch Number: <span className="text-gray-700">{data.batchNo}</span>
                            </Text>
                                
                             
                        </Group>

                        <Divider
                            my="sm"

                            label="Medicine Information"
                            labelPosition="center"
                        />

                        <Group justify="space-between" mt="sm">
                            <Text fw={500}>Quantity</Text>
                            <Text c="dimmed">{data.quantity}</Text>
                        </Group>

                        <Group justify="space-between" mt="xs">
                            <Text fw={500}>Unit Price</Text>
                            <Text c="dimmed">{data.unitPrice}</Text>
                        </Group>

                        <Group justify="space-between" mt="xs">
                            <Text fw={500}>Total Amount</Text>
                            <Text c="dimmed">₹{data.quantity * data.unitPrice} </Text>
                        </Group>


                    </Card>
                ))}
                {saleItems.length === 0 && (
                    <Text color="dimmed" size="sm" mt="md">
                        No Sales has been made in this pharmacy
                    </Text>
                )}
            </Modal>
        </div>
    );
};

export default Sales;
