import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { StaffActiveButton } from "@/components/admin/staff-active-button";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { formatDate } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { setStaffActive } from "./actions";

export default async function StaffPage() {
  const staff = await prisma.staff.findMany({ orderBy: [{ active: "desc" }, { joinedAt: "desc" }] });

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Staff"
        description="Trainers and front-desk team."
        actions={
          <Button asChild>
            <Link href="/admin/staff/new">
              <PlusIcon />
              Add staff
            </Link>
          </Button>
        }
      />

      <Card className="py-0">
        <CardContent className="p-0">
          {staff.length === 0 ? (
            <EmptyState
              title="No staff yet"
              description="Add your trainers and front-desk team to keep their details in one place."
              action={
                <Button asChild>
                  <Link href="/admin/staff/new">Add staff</Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="pl-4">Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="pl-4">
                      <Link href={`/admin/staff/${member.id}`} className="font-medium hover:underline">
                        {member.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{member.phone}</div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{formatDate(member.joinedAt)}</TableCell>
                    <TableCell>
                      {member.active ? (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/staff/${member.id}`}>Edit</Link>
                        </Button>
                        <StaffActiveButton
                          active={member.active}
                          onToggle={setStaffActive.bind(null, member.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
