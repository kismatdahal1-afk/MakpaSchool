import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormInput from "../../components/ui/FormInput.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFormValidation } from "../../hooks/useFormValidation.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { values, errors, handleChange, validateAll } = useFormValidation(
    { email: "", password: "" },
    {
      email: ["required", "email"],
      password: ["required"],
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validateAll()) return;

    setSubmitting(true);
    try {
      await login(values);
      const redirectPath = location.state?.from?.pathname || "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="card-surface space-y-4 p-7">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Login</h1>
          <p className="mt-1 text-sm text-slate-600">Access your school workspace.</p>
        </div>

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        {errorMessage ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm text-slate-600">
          No account yet?{" "}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
