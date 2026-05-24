import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/ui/FormInput.jsx";
import FormSelect from "../../components/ui/FormSelect.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFormValidation } from "../../hooks/useFormValidation.js";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { values, errors, handleChange, validateAll } = useFormValidation(
    { name: "", email: "", password: "", role: "student" },
    {
      name: ["required"],
      email: ["required", "email"],
      password: ["required", "min6"],
      role: ["required"],
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validateAll()) return;

    setSubmitting(true);
    try {
      await register(values);
      navigate("/dashboard", { replace: true });
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
          <h1 className="font-display text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="mt-1 text-sm text-slate-600">Join MakpaSchool and manage your role-specific dashboard.</p>
        </div>

        <FormInput
          label="Full Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
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
        <FormSelect
          label="Role"
          name="role"
          value={values.role}
          onChange={handleChange}
          error={errors.role}
          required
          options={[
            { value: "student", label: "Student" },
            { value: "teacher", label: "Teacher" },
            { value: "admin", label: "Admin" },
          ]}
        />

        {errorMessage ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-accent-300"
        >
          {submitting ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
