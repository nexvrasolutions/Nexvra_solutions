'use client';

import { useEffect, useState } from 'react';

type Option = { id: string; name: string; isActive: boolean; value?: string };

type OptionManagerProps = {
  type: 'department' | 'institution' | 'program-type';
  label: string;
  endpoint: string;
  valueOptions?: { label: string; value: string }[];
};

const KEYS = {
  department: { item: 'department', list: 'departments' },
  institution: { item: 'institution', list: 'institutions' },
  'program-type': { item: 'programType', list: 'programTypes' },
} as const;

async function request(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'Request failed.');
  return json;
}

export function OptionManagerClient({ type, label, endpoint, valueOptions }: OptionManagerProps) {
  const keys = KEYS[type];
  const [items, setItems] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  // No default: the admin must pick the stored type explicitly. Defaulting to the
  // first value silently saved e.g. an "Internship" label as COURSE.
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const lower = label.toLowerCase();

  useEffect(() => {
    request(endpoint)
      .then((data) => setItems(data[keys.list] || []))
      .catch((err: Error) => setError(err.message || 'Failed to load options.'))
      .finally(() => setLoading(false));
  }, [endpoint, keys.list]);

  const run = async (action: () => Promise<void>, success: string) => {
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(success);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (valueOptions && !value) {
      setMessage('');
      setError(`Choose which type this ${lower} saves.`);
      return;
    }
    setSaving(true);
    await run(async () => {
      const body: Record<string, unknown> = { name: name.trim() };
      if (valueOptions) body.value = value;
      const json = await request(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const created = json[keys.item] as Option;
      setItems((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      setValue('');
    }, `${label} created.`);
    setSaving(false);
  };

  const handleRename = async (item: Option) => {
    const newName = window.prompt(`Enter new ${lower} name:`, item.name);
    if (newName === null || newName.trim() === '' || newName.trim() === item.name) return;
    await run(async () => {
      const json = await request(`${endpoint}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const updated = json[keys.item] as Option;
      setItems((current) => current.map((i) => (i.id === item.id ? updated : i)));
    }, `${label} updated.`);
  };

  const handleToggle = async (item: Option) => {
    await run(async () => {
      const json = await request(`${endpoint}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const updated = json[keys.item] as Option;
      setItems((current) => current.map((i) => (i.id === item.id ? updated : i)));
    }, `${label} ${item.isActive ? 'deactivated' : 'activated'}.`);
  };

  const handleDelete = async (item: Option) => {
    if (!window.confirm(`Delete ${lower} "${item.name}"? Students keep the name but lose the link to this option.`)) return;
    await run(async () => {
      await request(`${endpoint}/${item.id}`, { method: 'DELETE' });
      setItems((current) => current.filter((i) => i.id !== item.id));
    }, `${label} deleted.`);
  };

  const usedValues = new Set(items.map((i) => i.value));

  return (
    <section className="min-w-0 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">{label} Management</h2>

      {error ? (
        <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      ) : null}
      {message ? (
        <div role="status" className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {message}
        </div>
      ) : null}

      <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-3">
        <label htmlFor={`new-${type}`} className="sr-only">
          New {lower} name
        </label>
        <input
          id={`new-${type}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`New ${lower} name`}
          maxLength={100}
          className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          required
        />
        {valueOptions ? (
          <>
            <label htmlFor={`new-${type}-value`} className="sr-only">
              {label} value
            </label>
            <select
              id={`new-${type}-value`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
              required
            >
              <option value="" disabled>
                Saves as… (choose a type)
              </option>
              {valueOptions.map((v) => (
                <option key={v.value} value={v.value} disabled={usedValues.has(v.value)}>
                  {v.label}
                  {usedValues.has(v.value) ? ' (already has an option)' : ''}
                </option>
              ))}
            </select>
          </>
        ) : null}
        <button
          type="submit"
          disabled={loading || saving}
          className="rounded-lg bg-[#0a0a0a] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Adding...' : `Add ${label}`}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-black/10 bg-[#f8f8f8]">
        <table className="min-w-full divide-y divide-black/10 text-sm">
          <thead className="bg-[#f5f5f5] text-xs uppercase tracking-wide text-black/60">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              {valueOptions ? <th className="px-4 py-3 text-left">Type</th> : null}
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-black/60">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-black/60">
                  No {lower}s yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-black/10">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  {valueOptions ? (
                    <td className="px-4 py-3 text-black/70">
                      {valueOptions.find((v) => v.value === item.value)?.label || item.value}
                    </td>
                  ) : null}
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleRename(item)} className="text-xs text-[#0a0a0a] underline">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleToggle(item)} className="text-xs text-[#0a0a0a] underline">
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button type="button" onClick={() => handleDelete(item)} className="text-xs text-red-600 underline hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
