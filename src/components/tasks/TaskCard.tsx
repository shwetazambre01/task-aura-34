import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Circle, Edit, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditTaskDialog from "./EditTaskDialog";
import TaskDetailsDialog from "./TaskDetailsDialog";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: any;
  onUpdate: () => void;
  isAdmin: boolean;
  className?: string;
}

const TaskCard = ({ task, onUpdate, isAdmin, className }: TaskCardProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleDelete = async () => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", task.id);

    if (error) {
      toast.error("Failed to delete task");
    } else {
      toast.success("Task deleted successfully");
      onUpdate();
    }
  };

  const toggleStatus = async () => {
    setUpdating(true);
    const newStatus = task.status === "completed" ? "pending" : "completed";

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", task.id);

    if (error) {
      toast.error("Failed to update task status");
    } else {
      toast.success(`Task marked as ${newStatus}`);
      onUpdate();
    }
    setUpdating(false);
  };

  const getPriorityBadge = () => {
    const colors = {
      high: "bg-priority-high text-priority-high-foreground",
      medium: "bg-priority-medium text-priority-medium-foreground",
      low: "bg-priority-low text-priority-low-foreground",
    };
    return colors[task.priority as keyof typeof colors] || "";
  };

  return (
    <>
      <Card className={cn("hover:shadow-lg transition-all cursor-pointer", className)} onClick={() => setDetailsDialogOpen(true)}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{task.title}</CardTitle>
            <Badge className={getPriorityBadge()}>
              {task.priority}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {task.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Due: {format(new Date(task.due_date), "MMM dd, yyyy")}
          </div>
          {task.assigned_to && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="w-4 h-4 mr-2" />
              {task.assigned_to.full_name || task.assigned_to.email}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button
            variant={task.status === "completed" ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus();
            }}
            disabled={updating}
            className="flex-1"
          >
            {task.status === "completed" ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 mr-2" />
                Pending
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setEditDialogOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        task={task}
        onUpdate={onUpdate}
        isAdmin={isAdmin}
      />

      <TaskDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        task={task}
      />
    </>
  );
};

export default TaskCard;