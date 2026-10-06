import { DataTools } from "@/components/admin/data-tools";
import { PageHeader } from "@/components/admin/page-header";

export default function DataPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Data" description="Import members from Excel and keep a backup you control." />
      <DataTools />
    </div>
  );
}
