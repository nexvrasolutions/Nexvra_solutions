import { requireSuperAdminSession } from '@/lib/auth';
import { OptionManagerClient } from '@/components/admin/option-manager';

export default async function OptionsPage() {
  await requireSuperAdminSession();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-black/50">Admin</p>
        <h1 className="mt-2 text-3xl font-bold">Option Management</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        <OptionManagerClient
          type="department"
          label="Department"
          endpoint="/api/admin/options/departments"
        />
        <OptionManagerClient
          type="institution"
          label="Institution"
          endpoint="/api/admin/options/institutions"
        />
        <OptionManagerClient
          type="program-type"
          label="Program Type"
          endpoint="/api/admin/options/program-types"
          valueOptions={[
            { label: 'Course', value: 'COURSE' },
            { label: 'Internship', value: 'INTERNSHIP' },
            { label: 'Custom', value: 'CUSTOM' },
          ]}
        />
      </div>
    </div>
  );
}
