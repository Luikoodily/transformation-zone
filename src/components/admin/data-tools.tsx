"use client";

import * as React from "react";
import { DownloadIcon, FileSpreadsheetIcon, HardDriveDownloadIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";

type SavePicker = (options: {
  suggestedName: string;
  types: { description: string; accept: Record<string, string[]> }[];
}) => Promise<{ createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }> }>;

type ImportResult = {
  membersAdded: number;
  membersSkipped: number;
  paymentsAdded: number;
  staffAdded: number;
  staffSkipped: number;
  errors: string[];
};

const LAST_BACKUP_KEY = "tz-last-backup";

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener("tz-backup", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("tz-backup", cb);
  };
};

function useLastBackup(): string | null {
  return React.useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(LAST_BACKUP_KEY),
    () => null
  );
}

export function BackupStatus() {
  const last = useLastBackup();
  return (
    <span className="text-xs text-muted-foreground">
      {last ? `Last backup saved ${new Date(last).toLocaleString()}` : "No backup saved from this browser yet"}
    </span>
  );
}

export function DataTools() {
  const [backingUp, setBackingUp] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const [result, setResult] = React.useState<ImportResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function fetchBackup(): Promise<{ blob: Blob; name: string }> {
    const res = await fetch("/api/admin/export");
    if (!res.ok) throw new Error("Could not create the backup");
    const name = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") ?? "")?.[1] ?? "tz-gym-backup.xlsx";
    return { blob: await res.blob(), name };
  }

  async function saveBackup() {
    setBackingUp(true);
    try {
      const { blob, name } = await fetchBackup();
      const picker = (window as unknown as { showSaveFilePicker?: SavePicker }).showSaveFilePicker;
      if (picker) {
        const handle = await picker({
          suggestedName: name,
          types: [{ description: "Excel workbook", accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
      }
      localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
      window.dispatchEvent(new Event("tz-backup"));
      toast.success("Backup saved");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      toast.error(e instanceof Error ? e.message : "Backup failed");
    } finally {
      setBackingUp(false);
    }
  }

  async function runImport(event: React.FormEvent) {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose an .xlsx file first.");
      return;
    }
    setImporting(true);
    setError(null);
    setResult(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/import", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Import failed");
      setResult(json);
      toast.success("Import finished");
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Backup &amp; export</CardTitle>
          <CardDescription>
            One Excel file with every member, payment and staff record. Keep a copy somewhere safe (USB, Drive) — it can be re-imported if data is ever lost.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveBackup} disabled={backingUp}>
              {backingUp ? <Loader2Icon className="animate-spin" /> : <HardDriveDownloadIcon />}
              Save backup to…
            </Button>
            <Button asChild variant="outline">
              <a href="/api/admin/export" download>
                <DownloadIcon />
                Quick download
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            &ldquo;Save backup to…&rdquo; lets you pick the folder in Chrome or Edge. Other browsers download to your usual folder.
          </p>
          <BackupStatus />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import from Excel</CardTitle>
          <CardDescription>
            Add many members at once, or restore from a backup. Existing members (same phone) are skipped, never overwritten.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Button asChild variant="outline" className="w-fit">
            <a href="/api/admin/template" download>
              <FileSpreadsheetIcon />
              Download template with dummy data
            </a>
          </Button>
          <form onSubmit={runImport} className="grid gap-3">
            <Input ref={fileRef} type="file" accept=".xlsx" aria-label="Excel file" className="bg-card" />
            <Button type="submit" disabled={importing} className="w-fit">
              {importing ? <Loader2Icon className="animate-spin" /> : <UploadIcon />}
              Import file
            </Button>
          </form>
          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}
          {result && (
            <div className="rounded-lg border bg-muted/60 p-3 text-sm">
              <p>
                Members added <strong>{result.membersAdded}</strong> (skipped {result.membersSkipped}) · payments added{" "}
                <strong>{result.paymentsAdded}</strong> · staff added <strong>{result.staffAdded}</strong> (skipped {result.staffSkipped})
              </p>
              {result.errors.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-xs text-destructive">
                  {result.errors.slice(0, 10).map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                  {result.errors.length > 10 && <li>…and {result.errors.length - 10} more</li>}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
