import { Avatar, Text } from "@mantine/core";
import {
  IconCalendarCheck,
  IconHeartbeat,
  IconLayoutGrid,
  IconUser,

} from "@tabler/icons-react";
import AvatarImage from "../../../assets/avatar.png";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const links = [
  {
    name: "Dashboard",
    url: "/patient/dashboard",
    icon: <IconLayoutGrid stroke={1.5} />,
  },
  {
    name: "Profile",
    url: "/patient/profile",
    icon: <IconUser stroke={1.5} />,
  },
  {
    name: "appointment",
    url: "/patient/appointments",
    icon: <IconCalendarCheck stroke={1.5} />,
  }
];


// best website for scrollbar is codepen scrollbar
const Sidebar = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user=useSelector((state:any)=> state.user);
  return (
    <div className="flex">
      <div className="w-64"></div>
      <div className="w-64 fixed h-screen overflow-auto hide-scrollbar bg-dark flex flex-col gap-7 items-center  ">
        <div className="text-primary-400 py-3 bg-dark flex gap-1 items-center fixed z-[500]">
          <IconHeartbeat size={40} stroke={2.5} />
          <span className="font-heading font-semibold text-3xl">Pulse</span>
        </div>
        <div className="flex flex-col mt-20 gap-5">
          <div className="flex flex-col gap-1 items-center">
            <div className="p-1 bg-white rounded-full shadow-lg">
              <Avatar
                variant="filled"
                src={AvatarImage}
                size="xl"
                alt="it's me"
              />
            </div>
            <span className="font-medium text-light">{user.name}</span>
            <Text c="dimmed" className="text-light" size="xs">
              {user.role}
            </Text>
          </div>

          <div className="flex flex-col gap-1 ">
            {links.map((link) => {
              return (
                <NavLink
                  to={link.url}
                  key={link.url}
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full font-medium px-4 py-5 rounded-lg ${
                      isActive
                        ? "bg-primary-400 text-dark"
                        : "hover:bg-gray-100 hover:text-dark "
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
