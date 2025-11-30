import {
  Button,
  PasswordInput,
  SegmentedControl,
  TextInput,
} from "@mantine/core";
import LoginBackground from "../Assets/login-background.jpg";
import { IconHeartbeat } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../Service/UserService";
import {
  errorNotification,
  successNotification,
} from "../utility/NotificationUtil";


const RegisterPage = () => {
  const navigate=useNavigate();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: "",
      role: "PATIENT",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) => (value ? null : "Name required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => {
        if (!value) return "Password required";
        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(value)
          ? null
          : "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character";
      },
      confirmPassword: (value, values) =>
        value === values.password ? null : "Password do not match",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    registerUser(values)
      .then((data) => {
        console.log("User registered successfully:", data);
        successNotification(data.message);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        errorNotification(error.response.data.errorMessage);
      });
    console.log(values);
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
            Register
          </div>
          <SegmentedControl
            {...form.getInputProps("role")}
            fullWidth
            size="md"
            radius="md"
            bg="none"
            color="pink"
            data={[
              { label: "Patient", value: "PATIENT" },
              { label: "Doctor", value: "DOCTOR" },
              { label: "Admin", value: "ADMIN" },
            ]}
            className="[&_*]:!text-white border border-white "
          />
          <TextInput
            {...form.getInputProps("name")}
            className="transition duration-300"
            variant="unstyled"
            size="md"
            radius="md"
            placeholder="Enter your name"
          />
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
          <PasswordInput
            {...form.getInputProps("confirmPassword")}
            className="transition duration-300"
            variant="unstyled"
            size="md"
            radius="md"
            placeholder=" Confirm Password"
          />
          <Button color="pink" radius="md" type="submit">
            Register
          </Button>
          <div className="text-neutral-100 text-sm hover:underline self-center ">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
