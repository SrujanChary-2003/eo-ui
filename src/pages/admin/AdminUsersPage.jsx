import { useEffect } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { PageHeader, StatusBadge } from "../../components/ui/PageBits";

export default function AdminUsersPage() {
  const { users, error, loadUsers, suspend } = useAdmin();

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div>
      <PageHeader title="Users" subtitle="Customers, vendors, and account status." />
      {error && <div className="mb-4"><Alert message={error} /></div>}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{user.role}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.isActive ? "approved" : "rejected"} />
                </td>
                <td className="px-4 py-3 text-right">
                  {user.role !== "admin" && (
                    <Button variant="ghost" onClick={() => suspend(user.id)}>
                      {user.isActive ? "Suspend" : "Activate"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
