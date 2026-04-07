const PersonalSignupFields = ({ form, onChange }) => (
  <>
    <input className="w-full rounded-lg border px-3 py-2" placeholder="Full Name" value={form.name} onChange={(e) => onChange("name", e.target.value)} required />
    <input className="w-full rounded-lg border px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={(e) => onChange("email", e.target.value)} required />
    <input className="w-full rounded-lg border px-3 py-2" type="tel" placeholder="Mobile Number" value={form.mobile} onChange={(e) => onChange("mobile", e.target.value)} required />
  </>
);

const OrganizationSignupFields = ({ form, onChange }) => (
  <>
    <input className="w-full rounded-lg border px-3 py-2" placeholder="Organization Name" value={form.organizationName} onChange={(e) => onChange("organizationName", e.target.value)} required />
    <input className="w-full rounded-lg border px-3 py-2" placeholder="Owner Name" value={form.ownerName} onChange={(e) => onChange("ownerName", e.target.value)} required />
    <input className="w-full rounded-lg border px-3 py-2" type="email" placeholder="Business Email" value={form.email} onChange={(e) => onChange("email", e.target.value)} required />
    <input className="w-full rounded-lg border px-3 py-2" type="tel" placeholder="Mobile Number" value={form.mobile} onChange={(e) => onChange("mobile", e.target.value)} required />
    <input className="w-full rounded-lg border px-3 py-2" placeholder="GST Number (Optional)" value={form.gstNumber} onChange={(e) => onChange("gstNumber", e.target.value)} />
  </>
);

export { OrganizationSignupFields, PersonalSignupFields };
