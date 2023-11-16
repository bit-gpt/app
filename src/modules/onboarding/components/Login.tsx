import type { FormEvent, ReactElement } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

import apiAuthd from "../../../shared/api/authd";
import PrimaryButton from "../../../shared/components/PrimaryButton";
import useSettingStore from "../../../shared/store/setting";

const Login = ({ redirectTo }: { redirectTo: ReactElement }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const setApiKey = useSettingStore((state) => state.setApiKey);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement & {
      user: { value: string };
      password: { value: string };
    };
    try {
      const user = target.user.value;
      const password = target.password.value;
      await apiAuthd()
        .get(`/login?user=${user}&pass=${password}`)
        .then((res) => {
          console.log("res", res);
          setIsAuthenticated(true);
          setApiKey(res.data);
        });
    } catch (error: any) {
      toast.error(error.message, { toastId: "login-error" });
    } finally {
      target.reset();
    }
  };

  if (isAuthenticated) {
    return redirectTo;
  }

  return (
    <div className="bg-grey-900 h-screen">
      <h1 className="text-2xl text-white text-center pt-4 pb-8">Login</h1>
      <form onSubmit={onSubmit} className="md:w-3/5 lg:w-2/5 mx-auto flex flex-col px-4 gap-y-6">
        <label className="text-white">
          User
          <input type="text" name="user" className="form-control" />
        </label>
        <label className="text-white">
          Password
          <input type="password" name="password" className="form-control" />
        </label>
        <PrimaryButton>Submit</PrimaryButton>
      </form>
    </div>
  );
};

export default Login;
