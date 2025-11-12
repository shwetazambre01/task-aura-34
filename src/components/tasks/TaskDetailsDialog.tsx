import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";
import { format } from "date-fns";

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any;
}

const TaskDetailsDialog = ({ open, onOpenChange, task }: TaskDetailsDialogProps) => {
  const getPriorityBadge = () => {
    const colors = {
      high: "bg-priority-high text-priority-high-foreground",
      medium: "bg-priority-medium text-priority-medium-foreground",
      low: "bg-priority-low text-priority-low-foreground",
    };
    return colors[task.priority as keyof typeof colors] || "";
  };

  const getStatusBadge = () => {
    return task.status === "completed"
      ? "bg-status-completed text-white"
      : "bg-status-pending text-white";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-2xl">{task.title}</DialogTitle>
              <div className="flex gap-2">
                <Badge className={getPriorityBadge()}>
                  {task.priority} priority
                </Badge>
                <Badge className={getStatusBadge()}>
                  {task.status}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {task.description || "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(task.due_date), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>

            {task.assigned_to_profile && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Assigned To</p>
                  <p className="text-sm text-muted-foreground">
                    {task.assigned_to_profile.full_name || task.assigned_to_profile.email}
                  </p>
                </div>
              </div>
            )}

            {task.created_by_profile && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created By</p>
                  <p className="text-sm text-muted-foreground">
                    {task.created_by_profile.full_name || task.created_by_profile.email}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created At</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(task.created_at), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;