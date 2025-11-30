import {  Badge, Breadcrumbs, Card, Divider, Group, Tabs, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { getAppointmentDetails } from "../../../Service/AppointmentService";
import { IconClipboardHeart, IconClock, IconMail, IconPhone, IconStethoscope, IconUser, IconVaccine } from "@tabler/icons-react";
import { formatDateWithTime } from "../../../utility/DateUtility";
import ApReport from "./ApReport";
import Prescription from "./Prescription";


interface AppointmentProps {
  patientId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentTime: string;
  reason: string;
  status: string;
  notes: string;
}

const AppointmentDetails = () => {
    const {id}=useParams();
    const [appointment,setAppointment]=useState<AppointmentProps>({
        patientId:0,
        patientName:"",
        patientEmail:"",
        patientPhone:"",
        appointmentTime:"",
        reason:"",
        status:"",
        notes:""
    });

    useEffect(()=>{
        getAppointmentDetails(id).then((data)=>{
            setAppointment(data)
            console.log("Data is ",data);
        }).catch((error)=>{
            console.log("Error fetching appointment details "+error);
        })
    },[id])

const {
  patientId,
  patientName,
  patientEmail,
  patientPhone,
  appointmentTime,
  reason,
  status,
  notes,}=appointment;
  return (
    <div>
        <Breadcrumbs mb="md">
        <Link className="text-primary-400 hover:underline" to="/doctor/dashboard">Dashboard</Link>
        <Link className="text-primary-400 hover:underline" to="/doctor/appointments">Appointments</Link>
        <Text className="text-primary-400">Details</Text>
        </Breadcrumbs>

       <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Text fw={600} size="lg">
          Appointment #{id}
        </Text>
        <Badge color={status === "SCHEDULED" ? "green" : "gray"}>{status}</Badge>
      </Group>

      <Divider my="sm" label="Patient Details" labelPosition="center" />

      <Group mt="sm">
        <IconUser size={18} />
        <Text fw={500}>{patientName}</Text>
      </Group>

      <Group gap="xs" mt={4}>
        <IconMail size={16} />
        <Text size="sm" c="dimmed">
          {patientEmail}
        </Text>
      </Group>

      <Group gap="xs" mt={4}>
        <IconPhone size={16} />
        <Text size="sm" c="dimmed">
          {patientPhone}
        </Text>
      </Group>

      <Divider my="sm" label="Appointment Details" labelPosition="center" />

    <Text mt="sm"  fw={700}>
        Appointment Time:
      </Text>
      <Group gap="xs" mt="xs">
        <IconClock size={18} />
        <Text size="sm" fw={500}>
          {formatDateWithTime(appointmentTime)}
        </Text>
      </Group>

      <Text mt="sm"  fw={700}>
        Reason:
      </Text>
      <Text size="sm" c="dimmed">
        {reason}
      </Text>

      <Text mt="sm" fw={700}>
        Notes:
      </Text>
      <Text size="sm" c="dimmed">
        {notes}
      </Text>
    </Card>

    <Tabs variant="pills" defaultValue="medical" mt="lg">
      <Tabs.List>
        <Tabs.Tab value="medical" leftSection={<IconStethoscope size={20} />}>
          Medical History
        </Tabs.Tab>
        <Tabs.Tab value="prescriptions" leftSection={<IconVaccine size={20} />}>
          Prescriptions
        </Tabs.Tab>
        <Tabs.Tab value="reports" leftSection={<IconClipboardHeart size={20} />}>
          Reports
        </Tabs.Tab>
      </Tabs.List>

      <Divider my="sm"  labelPosition="center" />

      <Tabs.Panel value="medical">
        Medical
      </Tabs.Panel>

      <Tabs.Panel value="prescriptions">
         <Prescription appointment={appointment} />
      </Tabs.Panel>

      <Tabs.Panel value="reports">
        <ApReport appointment={appointment}/>
      </Tabs.Panel>
    </Tabs>
    </div>
  )
}

export default AppointmentDetails