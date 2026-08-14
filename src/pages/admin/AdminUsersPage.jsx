import { useEffect, useState } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { EmptyState, PageHeader, PaginationBar, StatusBadge } from "../../components/ui/PageBits";
import { asArray, resourceId } from "../../utils/safe";
import { PAGE_SIZE } from "../../utils/pagination";
import { getPasswordProof } from "../../apis/admin/admin.api";
import { getApiErrorMessage } from "../../utils/authErrors";

export default function AdminUsersPage() {
  const { users, usersPagination, error, loadUsers, suspend } = useAdmin();
  const [page, setPage] = useState(1);
  const [proof, setProof] = useState(null);
  const [proofError, setProofError] = useState("");
  const [proofLoading, setProofLoading] = useState(false);

  useEffect(() => {
    loadUsers({ page, limit: PAGE_SIZE });
  }, [loadUsers, page]);

  const revealProof = async (userId) => {
    setProofError("");
    setProofLoading(true);
    try {
      const response = await getPasswordProof(userId);
      setProof(response.data || response);
    } catch (err) {
      setProofError(getApiErrorMessage(err, "Could not load password proof"));
    } finally {
      setProofLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Customers, vendors, and account status. Password proof is admin-only." />
      {error && <div className="mb-4"><Alert message={error} /></div>}
      {proofError && <div className="mb-4"><Alert message={proofError} /></div>}
      {!asArray(users).length && (
        <EmptyState title="No users">No accounts match this view yet.</EmptyState>
      )}
      {asArray(users).length > 0 && (
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
            {asArray(users).map((user, index) => {
              const id = resourceId(user);
              return (
              <tr key={id || `user-${index}`} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{user?.firstName || ""} {user?.lastName || ""}</td>
                <td className="px-4 py-3 text-muted-foreground">{user?.email || "—"}</td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{user?.role || "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={user?.isActive ? "approved" : "rejected"} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {id && user?.role !== "admin" && (
                      <Button variant="ghost" onClick={() => revealProof(id)} loading={proofLoading}>
                        Password proof
                      </Button>
                    )}
                    {user?.role !== "admin" && id && (
                      <Button variant="ghost" onClick={() => suspend(id)}>
                        {user?.isActive ? "Suspend" : "Activate"}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
      <PaginationBar pagination={usersPagination} onPage={setPage} />
      <ConfirmDialog
        open={Boolean(proof)}
        title="Password proof"
        message="Show this only after you have verified the account owner. Do not share it with anyone else."
        confirmLabel="Hide"
        cancelLabel="Close"
        onConfirm={() => setProof(null)}
        onCancel={() => setProof(null)}
      >
        {proof ? (
          <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3 text-sm">
            <p className="text-[var(--app-muted)]">{proof.email}</p>
            <p className="mt-1 font-mono text-[var(--app-text)]">{proof.passwordProof}</p>
          </div>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
