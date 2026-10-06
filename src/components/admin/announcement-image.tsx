"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, Trash2Icon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";

export function AnnouncementImage({ id, hasImage }: { id: string; hasImage: boolean }) {
  const router = useRouter();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [version, setVersion] = React.useState(0);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch(`/api/admin/announcements/${id}/image`, { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      toast.success("Image uploaded");
      setVersion((v) => v + 1);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove() {
    const res = await fetch(`/api/admin/announcements/${id}/image`, { method: "DELETE" });
    if (!res.ok) return { ok: false as const, message: "Could not delete the image" };
    setVersion((v) => v + 1);
    router.refresh();
    return { ok: true as const, message: "Image removed" };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Poster image</CardTitle>
        <CardDescription>Upload the flyer or poster for this post. Shown instead of the link preview.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {hasImage && (
          <div className="relative w-fit">
            {/* admin-uploaded image, served from our own API route */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={version}
              src={`/api/admin/announcements/${id}/image?v=${version}`}
              alt="Current poster"
              className="h-40 w-auto rounded-md border object-cover"
            />
            <ConfirmActionButton
              trigger={
                <Button variant="destructive" size="icon-sm" className="absolute top-1.5 right-1.5" aria-label="Delete image">
                  <Trash2Icon />
                </Button>
              }
              title="Delete this image?"
              description="The post reverts to showing its link (if any) with no poster."
              confirmLabel="Delete image"
              action={remove}
            />
          </div>
        )}
        <form onSubmit={upload} className="flex flex-wrap items-center gap-2">
          <Input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="max-w-xs bg-card" />
          <Button type="submit" disabled={uploading} variant="outline">
            {uploading ? <Loader2Icon className="animate-spin" /> : <UploadIcon />}
            {hasImage ? "Replace image" : "Upload image"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
