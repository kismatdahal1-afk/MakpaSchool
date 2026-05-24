import { useState } from "react";
import FormInput from "../../components/ui/FormInput.jsx";
import { useFormValidation } from "../../hooks/useFormValidation.js";

const ContactPage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const { values, errors, handleChange, validateAll, reset } = useFormValidation(
    { name: "", email: "", message: "" },
    {
      name: ["required"],
      email: ["required", "email"],
      message: ["required", (value) => (value.length >= 10 ? "" : "Message must be at least 10 characters.")],
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage("");

    if (!validateAll()) return;

    setSuccessMessage("Thanks for contacting us. We will reach out to you shortly.");
    reset();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <aside className="card-surface p-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Contact Us</h1>
        <p className="mt-3 text-sm text-slate-600">
          Have questions about admissions, features, or technical support? Send us a message.
        </p>
        <div className="mt-6 space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Email:</span> support@makpaschool.com
          </p>
          <p>
            <span className="font-semibold">Phone:</span> +977-01-4000000
          </p>
          <p>
            <span className="font-semibold">Office:</span> Kathmandu, Nepal
          </p>
        </div>
      </aside>

      <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6">
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
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Message <span className="text-rose-500">*</span>
          </span>
          <textarea
            name="message"
            rows="5"
            value={values.message}
            onChange={handleChange}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition ${
              errors.message ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-brand-500"
            }`}
          />
          {errors.message ? <span className="mt-1 block text-xs text-rose-600">{errors.message}</span> : null}
        </label>

        {successMessage ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
