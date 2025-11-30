import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const successNotification = (message: string) => {
  notifications.show({
    title: "success",
    message: message,
    color: "teal",
    icon: <IconCheck />,
    withCloseButton: true,
    withBorder: true,
    className: "!border-green-500",
  });
};

const errorNotification = (message: string) => {
  notifications.show({
    title: "error",
    message: message,
    color: "red",
    icon: <IconX />,
    withCloseButton: true,
    withBorder: true,
    className: "!border-red-500",
  });
};

export { successNotification, errorNotification };
