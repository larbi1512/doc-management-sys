import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authThunks";
import { RootState, AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isChecked, setIsChecked] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password }) as any).unwrap();
      // Remove navigate("/") here
    } catch (error) {
      console.error("Failed to sign in", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Sign In
        </h1>
        <p className="text-sm text-gray-500">Enter your email and password to sign in!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Email <span className="text-error-500">*</span></Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@gmail.com"  />
          </div>
          <div>
            <Label>Password <span className="text-error-500">*</span></Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-1/2">
                {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Checkbox checked={isChecked} onChange={setIsChecked} />
            <span className="text-gray-700">Keep me logged in</span>
            <Link to="/reset-password" className="text-brand-500 hover:text-brand-600">Forgot password?</Link>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" size="sm" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign in"}</Button>
        </form>
      </div>
    </div>
  );
}
