import { useSelector } from "react-redux"
import AvatarImage from "../../../assets/avatar.png";
import {DateInput} from '@mantine/dates';
import { Avatar, Button, Divider, Modal, NumberInput, Select, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconCalendarStar, IconEdit, IconUpload } from "@tabler/icons-react";
import {  doctorDeparments, doctorSpecializations } from "../../../Data/DropDownData";
import { useDisclosure } from "@mantine/hooks";
import { getDoctor, updateDoctor } from "../../../Service/DoctorProfileService";
import { formatDate } from "../../../utility/DateUtility";
import { errorNotification, successNotification } from "../../../utility/NotificationUtil";
import { useForm } from "@mantine/form";


const DoctorProfile = () => {
    const [editMode,setEditMode]=useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user=useSelector((state:any)=>state.user);
    const [opened, {open,close}]=useDisclosure(false);
    const [profile, setProfile] = useState<any>({});


  const form = useForm({
    initialValues: {
      dob: profile.dob ? new Date(profile.dob) : undefined,
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      licenseNo: profile.licenseNo?? "",
      specialization: profile.specialization ?? "",
      department: profile.department ?? "",
      totalExp: profile.totalExp ?? "",
    },
    validate: {
      dob: (value) => (!value ? "Date of Birth Required" : undefined),
      phone: (value:string) => (!value ? "Phone Number Required" : undefined),
      address: (value:string) => (!value ? "Address Required" : undefined),
      licenseNo: (value:string) => (!value ? "License Number Required" : undefined),
      department: (value:string) => (!value ? "department Required" : undefined),
      specialization: (value:string) => (!value ? "Specialization Required" : undefined),
      totalExp: (value:number) => (!value ? "Total Experience Required" : undefined),
    },
  });

  useEffect(() => {
   getDoctor(user.profileId).then((data)=>{
    setProfile({...data})
   }).catch((error)=>{
    console.error(error);
   })
  }, []);

  const handleSubmit = () => {
    form.validate();
    if (!form.isValid()) return;
    const value = form.getValues();
    const payload={...profile, ...value};
    console.log("API Call Payload:", payload);
    updateDoctor(payload)
      .then((_data) => {
        successNotification("Profile Updated Successfully");
        setEditMode(false);
        setProfile({
          ...profile, ...value
        });
      })
      .catch((error) => {
        console.error("Error updating patient:", error);
        errorNotification(error.response?.data.errorMessage);
      });
  };

  const handleEdit = () => {
    form.setValues({...profile})
    setEditMode(true);
  };

  
  return (
    <div className="p-10">
        <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
            <div className="flex flex-col items-center gap-3">
                 <Avatar variant="filled" src={AvatarImage} size={100}  alt="it's me"/>
                 {editMode &&<Button size="sm" onClick={open} className="mt-3" variant="filled" leftSection={<IconUpload/>}>Upload Image</Button>}
            </div>
       
        <div className=" flex flex-col gap-3 ">
            <div className="text-3xl font-medium text-neutral-900">{user.name.charAt().toUpperCase() + user.name.slice(1)}</div>
            <div className="text-xl text-neutral-700">{user.email}</div>
        </div>
        </div>
       {!editMode ? (
          <Button
            size="lg"
            type="button"
            onClick={handleEdit}
            variant="filled"
            leftSection={<IconEdit />}
          >
            Edit
          </Button>
        ) : (
          <Button
            size="lg"
            type="submit"
            variant="filled"
            onClick={handleSubmit}
            leftSection={<IconCalendarStar />}
          >
            Submit
          </Button>
        )}
        </div>
        <Divider my="xl"/>
        <div className=" text-2xl font-medium text-neutral-900 mb-5">
    Personal Information
        <Table striped stripedColor="gray.5" verticalSpacing="md" withColumnBorders={true}   
         withRowBorders={false}>
             <Table.Tbody className="[&>tr]:!mb-3 [&_td]:!w-1/2">
          {/* DOB */}
          <Table.Tr>
            <Table.Td className="text-xl font-semibold">Date of Birth</Table.Td>
            <Table.Td className="text-xl">
              {editMode ? (
                <DateInput
                  value={form.values.dob}
                  onChange={(value) => form.setFieldValue("dob", value)}
                  placeholder="Enter Date of Birth"
                />
              ) : (
                formatDate(profile.dob) ?? "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Phone */}
          <Table.Tr>
            <Table.Td className="text-xl font-semibold">Phone</Table.Td>
            <Table.Td className="text-xl">
              {editMode ? (
                <NumberInput
                  value={form.values.phone}
                  onChange={(value) => form.setFieldValue("phone", value)}
                  hideControls
                  clampBehavior="strict"
                  placeholder="Enter Phone Number"
                />
              ) : (
                profile.phone ?? "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Address */}
          <Table.Tr>
            <Table.Td className="text-xl font-semibold">Address</Table.Td>
            <Table.Td className="text-xl">
              {editMode ? (
                <TextInput
                  value={form.values.address}
                  onChange={(e) =>
                    form.setFieldValue("address", e.currentTarget.value)
                  }
                  placeholder="Enter Address"
                />
              ) : (
                profile.address ?? "-"
              )}
            </Table.Td>
          </Table.Tr>
                <Table.Tr>
                    <Table.Td className="text-xl font-semibold">License No</Table.Td>
                    {editMode? <Table.Td className="text-xl"><NumberInput maxLength={12} minLength={12} hideControls  
  max={999999999999}

  clampBehavior="strict" 
                    {...form.getInputProps("licenseNo")}  placeholder="Enter License No"/></Table.Td> : <Table.Td className="text-xl">{profile.licenseNo ?? "-"}</Table.Td>}
                </Table.Tr>

                <Table.Tr>
                    <Table.Td className="text-xl font-semibold">Specialization</Table.Td>
                    {editMode? <Table.Td className="text-xl"><Select
                     {...form.getInputProps("specialization")} data={doctorSpecializations} placeholder="Select Specialization"/></Table.Td> : <Table.Td className="text-xl">{profile.specialization ?? "-"}</Table.Td>}
                </Table.Tr>
                 
                <Table.Tr>
                    <Table.Td className="text-xl font-semibold">Department</Table.Td>
                  {editMode? <Table.Td className="text-xl"><Select
                   {...form.getInputProps("department")}
                  data={doctorDeparments}   placeholder="Enter Department"/></Table.Td> : <Table.Td className="text-xl">{profile.department ?? "-"}</Table.Td>}
                </Table.Tr>

                <Table.Tr>
                    <Table.Td className="text-xl font-semibold">Total Exprience</Table.Td>
                  {editMode? <Table.Td className="text-xl"><NumberInput 
                  {...form.getInputProps("totalExp")}
                  hideControls clampBehavior="strict" max={25} maxLength={2}   placeholder="Enter Total Experience"/></Table.Td> : <Table.Td className="text-xl">{profile.totalExp ?? "-"}</Table.Td>}
                </Table.Tr>
            </Table.Tbody>
        </Table>
        </div>
        <Modal centered opened={opened} onClose={close} title={<span className="text-xl font-medium">Upload Image</span>
        }></Modal>
    </div>
  )
}

export default DoctorProfile