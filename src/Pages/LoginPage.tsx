import { Button, PasswordInput, TextInput } from "@mantine/core";
import LoginBackground from "../Assets/login-background.jpg";
import { IconHeartbeat } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { Link} from "react-router-dom";
import { loginUser } from "../Service/UserService";
import {jwtDecode} from "jwt-decode";
import {
  errorNotification,
  successNotification,
} from "../utility/NotificationUtil";
import { useDispatch } from "react-redux";
import { setJwt } from "../Slices/JwtSlice";
import { setUser } from "../Slices/UserSlice";


const LoginPage = () => {
  const dispatch=useDispatch();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (!value ? "Password required" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
  loginUser(values)
    .then((_data) => {
      dispatch(setJwt(_data));
      dispatch(setUser(jwtDecode(_data)));
      successNotification("Login successful");
    })
    .catch((error) => {
      console.error("Error logging in user:", error);
      errorNotification(error?.response?.data?.errorMessage || "Login failed");
    });
};

  return (
    <div
      style={{ backgroundImage: `url(${LoginBackground})` }}
      className="h-screen w-screen !bg-cover !bg-center !bg-no-repeat flex flex-col  items-center justify-center"
    >
      <div className="text-pink-500 py-3  flex gap-1 items-center  ">
        <IconHeartbeat size={45} stroke={2.5} />
        <span className="font-heading font-semibold text-4xl">Pulse</span>
      </div>
      <div className="w-[400px] backdrop-blur-md p-10 py-8 rounded-xl ">
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-5 [&_input]:!placeholder-neutral-100 [&_.mantine-Input-input]:!border-white focus-within:[&_.mantine-Input-input]:!border-pink-400 [&_.mantine-Input-input]:!border [&_input]:!pl-2 [&_svg]:!text-white  [&_input]:text-white"
        >
          <div className="self-center font-medium font-heading text-white text-xl">
            Login
          </div>
          <TextInput
            {...form.getInputProps("email")}
            className="transition duration-300"
            variant="unstyled"
            size="md"
            radius="md"
            placeholder="Email"
          />
          <PasswordInput
            {...form.getInputProps("password")}
            className="transition duration-300"
            variant="unstyled"
            size="md"
            radius="md"
            placeholder="Password"
          />
          <Button color="pink" radius="md" type="submit">
            Login
          </Button>
          <div className="text-neutral-100 text-sm hover:underline self-center ">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    
    </div>
  );
};

export default LoginPage;
