import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard from "./TaskCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface TaskListProps {
  userId: string;
  isAdmin: boolean;
}

const TASKS_PER_PAGE = 9;

const TaskList = ({ userId, isAdmin }: TaskListProps) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [selectedPriority, setSelectedPriority] = useState<"all" | "high" | "medium" | "low">("all");

  useEffect(() => {
    fetchTasks();
  }, [userId, currentPage, selectedPriority]);

  const fetchTasks = async () => {
    setLoading(true);
    
    let query = supabase
      .from("tasks")
      .select("*, assigned_to_profile:assigned_to(full_name, email), created_by_profile:created_by(full_name, email)", { count: "exact" });

    if (selectedPriority !== "all") {
      query = query.eq("priority", selectedPriority);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range((currentPage - 1) * TASKS_PER_PAGE, currentPage * TASKS_PER_PAGE - 1);

    if (error) {
      toast.error("Failed to fetch tasks");
      console.error(error);
    } else {
      setTasks(data || []);
      setTotalTasks(count || 0);
    }

    setLoading(false);
  };

  const handleTaskUpdate = () => {
    fetchTasks();
  };

  const totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-priority-high";
      case "medium":
        return "border-l-4 border-l-priority-medium";
      case "low":
        return "border-l-4 border-l-priority-low";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" onValueChange={(value) => setSelectedPriority(value as "all" | "high" | "medium" | "low")}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="high" className="text-priority-high">High</TabsTrigger>
          <TabsTrigger value="medium" className="text-priority-medium">Medium</TabsTrigger>
          <TabsTrigger value="low" className="text-priority-low">Low</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPriority} className="mt-6">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    isAdmin={isAdmin}
                    className={getPriorityColor(task.priority)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;