"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  HardHat,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import WorkerProtectedRoute from "@/components/WorkerProtectedRoute";
import WorkerForm from "@/components/WorkerForm";
import WorkerProfileCard from "@/components/WorkerProfile";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { SkeletonCard } from "@/components/Loader";
import {
  getWorkerApiErrorMessage,
  useWorkerAuth,
} from "@/context/WorkerAuthContext";
import { WorkerCreatePayload } from "@/types/worker";

type DashboardView = "view" | "create" | "edit";

function WorkerDashboardContent() {
  const {
    workerAccount,
    workerProfile,
    isProfileLoading,
    logout,
    refreshProfile,
    createProfile,
    updateProfile,
    removeProfile,
  } = useWorkerAuth();

  const [view, setView] = useState<DashboardView>("view");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProfile();
      toast.success("Profile refreshed");
    } catch (error) {
      toast.error(getWorkerApiErrorMessage(error, "Failed to refresh profile"));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreate = async (payload: WorkerCreatePayload) => {
    setIsSubmitting(true);
    try {
      await createProfile(payload);
      toast.success("Worker profile created successfully");
      setView("view");
    } catch (error) {
      toast.error(getWorkerApiErrorMessage(error, "Failed to create profile"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (payload: WorkerCreatePayload) => {
    setIsSubmitting(true);
    try {
      await updateProfile(payload);
      toast.success("Worker profile updated successfully");
      setView("view");
    } catch (error) {
      toast.error(getWorkerApiErrorMessage(error, "Failed to update profile"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeProfile();
      toast.success("Worker profile deleted");
      setDeleteOpen(false);
      setView("create");
    } catch (error) {
      toast.error(getWorkerApiErrorMessage(error, "Failed to delete profile"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <HardHat className="h-3.5 w-3.5" />
              Worker Portal
            </div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Worker Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Manage your professional worker profile
              {workerAccount?.mobile ? ` · ${workerAccount.mobile}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              isLoading={isRefreshing}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {isProfileLoading ? (
          <SkeletonCard />
        ) : view === "create" || (!workerProfile && view !== "edit") ? (
          <div className="rounded-xl border border-white/40 bg-white/70 p-6 shadow-sm backdrop-blur-md">
            <div className="mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">Create Worker Profile</h2>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              Complete your profile so customers can find and hire you.
            </p>
            <WorkerForm
              defaultMobile={workerAccount?.mobile}
              submitLabel="Create Profile"
              isSubmitting={isSubmitting}
              onSubmit={handleCreate}
              onCancel={workerProfile ? () => setView("view") : undefined}
            />
          </div>
        ) : view === "edit" && workerProfile ? (
          <div className="rounded-xl border border-white/40 bg-white/70 p-6 shadow-sm backdrop-blur-md">
            <div className="mb-6 flex items-center gap-2">
              <Pencil className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">Edit Worker Profile</h2>
            </div>
            <WorkerForm
              initialData={workerProfile}
              defaultMobile={workerAccount?.mobile}
              submitLabel="Save Changes"
              isSubmitting={isSubmitting}
              onSubmit={handleUpdate}
              onCancel={() => setView("view")}
            />
          </div>
        ) : workerProfile ? (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setView("edit")}>
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" />
                Delete Profile
              </Button>
            </div>
            <WorkerProfileCard profile={workerProfile} />
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-12 text-center">
            <HardHat className="mx-auto mb-4 h-12 w-12 text-emerald-300" />
            <p className="text-lg font-medium text-gray-700">No worker profile yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Create your profile to start receiving work requests
            </p>
            <Button className="mt-4" size="sm" onClick={() => setView("create")}>
              <Plus className="h-4 w-4" />
              Add Profile
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Worker Profile"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete your worker profile? This action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setDeleteOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function WorkerDashboardPage() {
  return (
    <WorkerProtectedRoute>
      <WorkerDashboardContent />
    </WorkerProtectedRoute>
  );
}
