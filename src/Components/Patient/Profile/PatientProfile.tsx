import { useSelector } from "react-redux";
import AvatarImage from "../../../assets/avatar.png";
import { DateInput } from "@mantine/dates";
import {
  Avatar,
  Button,
  Divider,
  Modal,
  NumberInput,
  Select,
  Table,
  TagsInput,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconCalendarStar, IconEdit, IconUpload } from "@tabler/icons-react";
import { BloodGroups } from "../../../Data/DropDownData";
import { useDisclosure } from "@mantine/hooks";
import {
  getPatient,
  updatePatient,
} from "../../../Service/PatientProfileService";
import { formatDate } from "../../../utility/DateUtility";
import { useForm } from "@mantine/form";
import {
  errorNotification,
  successNotification,
} from "../../../utility/NotificationUtil";

const PatientProfile = () => {
  const [editMode, setEditMode] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.user);
  const [opened, { open, close }] = useDisclosure(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    getPatient(user.profileId)
      .then((data) => {
        setProfile({
          ...data,
          allergies: data.allergies ? JSON.parse(data.allergies) : [],
          chronicDisease: data.chronicDisease ? JSON.parse(data.chronicDisease) : [],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user.profileId]);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      dob: profile.dob ? new Date(profile.dob) : undefined,
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      aadharNo: profile.aadharNo ?? "",
      bloodGroup: profile.bloodGroup ?? "",
      allergies: profile.allergies ?? [],
      chronicDisease: profile.chronicDisease ?? [],
    },
    validate: {
      dob: (value) => (!value ? "Date of Birth Required" : undefined),
      phone: (value) => (!value ? "Phone Number Required" : undefined),
      address: (value) => (!value ? "Address Required" : undefined),
      aadharNo: (value) => (!value ? "Aadhar Number Required" : undefined),
      bloodGroup: (value) => (!value ? "Blood Group Required" : undefined),
    },
  });

  useEffect(() => {
    // Sync form values when profile updates
    form.setValues({
      dob: profile.dob ? new Date(profile.dob) : undefined,
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      aadharNo: profile.aadharNo ?? "",
      bloodGroup: profile.bloodGroup ?? "",
      allergies: profile.allergies ?? [],
      chronicDisease: profile.chronicDisease ?? [],
    });
  }, []);

  const handleSubmit = () => {
    form.validate();
    if (!form.isValid()) return;

    const value = form.getValues();

    const payload = {
      ...profile,
      ...value,
      dob: value.dob ? value.dob.toISOString().split("T")[0] : null,
      allergies: JSON.stringify(value.allergies ?? []),
      chronicDisease: JSON.stringify(value.chronicDisease ?? []),
    };

    updatePatient(payload)
      .then((data) => {
        successNotification("Profile Updated Successfully");
        setEditMode(false);
        setProfile({
          ...data,
          allergies: JSON.parse(data.allergies),
          chronicDisease: JSON.parse(data.chronicDisease),
        });
      })
      .catch((error) => {
        console.error("Error updating patient:", error);
        errorNotification(error.response?.data.errorMessage);
      });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <div className="p-10">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <div className="flex flex-col items-center gap-3">
            <Avatar variant="filled" src={AvatarImage} size={100} alt="avatar" />
            {editMode && (
              <Button
                size="sm"
                onClick={open}
                className="mt-3"
                variant="filled"
                leftSection={<IconUpload />}
              >
                Upload Image
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-3xl font-medium text-neutral-900">
              {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </div>
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

      <Divider my="xl" />

      {/* Personal Information Section */}
      <div className="text-2xl font-medium text-neutral-900 mb-5">
        Personal Information
      </div>

      <Table
        striped
        stripedColor="gray.5"
        verticalSpacing="md"
        withColumnBorders
        withRowBorders={false}
      >
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

          {/* Aadhar */}
          <Table.Tr>
            <Table.Td className="text-xl font-semibold">Aadhar No</Table.Td>
            <Table.Td className="text-xl">
              {editMode ? (
                <NumberInput
                  value={form.values.aadharNo}
                  onChange={(value) => form.setFieldValue("aadharNo", value)}
                  hideControls
                  clampBehavior="strict"
                  placeholder="Enter Aadhar Number"
                />
              ) : (
                profile.aadharNo ?? "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Blood Group */}
          <Table.Tr>
            <Table.Td className="text-xl font-semibold">Blood Group</Table.Td>
            <Table.Td className="text-xl">
              {editMode ? (
                <Select
                  data={Array.from(BloodGroups, ([key, value]) => ({
                    value: key,
                    label: value,
                  }))}
                  value={form.values.bloodGroup}
                  onChange={(value) =>
                    form.setFieldValue("bloodGroup", value ?? "")
                  }
                  placeholder="Select Blood Group"
                />
              ) : (
                BloodGroups.get(profile.bloodGroup) ?? "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Allergies */}
          <Table.Tr>
            <Table.Td className="text-xl font-semibold">Allergies</Table.Td>
            <Table.Td className="text-xl">
              {editMode ? (
                <TagsInput
                  value={form.values.allergies}
                  onChange={(value) => form.setFieldValue("allergies", value)}
                  placeholder="Enter Allergies"
                />
              ) : profile.allergies?.length ? (
                profile.allergies.join(", ")
              ) : (
                "-"
              )}
            </Table.Td>
          </Table.Tr>

          {/* Chronic Disease */}
          <Table.Tr>
            <Table.Td className="text-xl font-semibold">
              Chronic Disease
            </Table.Td>
            <Table.Td className="text-xl">
              {editMode ? (
                <TagsInput
                  value={form.values.chronicDisease}
                  onChange={(value) =>
                    form.setFieldValue("chronicDisease", value)
                  }
                  placeholder="Enter Chronic Disease"
                />
              ) : profile.chronicDisease?.length ? (
                profile.chronicDisease.join(", ")
              ) : (
                "-"
              )}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      {/* Upload Image Modal */}
      <Modal
        centered
        opened={opened}
        onClose={close}
        title={<span className="text-xl font-medium">Upload Image</span>}
      />
    </div>
  );
};

export default PatientProfile;
