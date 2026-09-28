"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { TaskCard, Task } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  Timestamp
} from "firebase/firestore";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // READ: Fetch tasks in real-time
  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = snapshot.docs.map(doc => {
        const data = doc.data();
        let dueDateStr = "";
        if (data.dueDate && data.dueDate.toDate) {
          dueDateStr = data.dueDate.toDate().toISOString().split('T')[0];
        }

        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          completed: data.completed,
          priority: data.priority,
          dueDate: dueDateStr
        } as Task;
      });
      setTasks(tasksData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // CREATE / UPDATE
  const handleSaveTask = async (taskData: Omit<Task, 'id'>) => {
    if (!user) return;
    setModalLoading(true);
    setModalError(null);

    try {
      const tasksRef = collection(db, "users", user.uid, "tasks");

      let dueDateTimestamp = null;
      if (taskData.dueDate) {
        const dateObj = new Date(taskData.dueDate);
        if (!isNaN(dateObj.getTime())) {
          dueDateTimestamp = Timestamp.fromDate(dateObj);
        }
      }

      const taskToSave = {
        title: taskData.title,
        description: taskData.description,
        completed: taskData.completed,
        priority: taskData.priority,
        dueDate: dueDateTimestamp,
      };

      if (editingTask) {
        // UPDATE
        const taskDoc = doc(tasksRef, editingTask.id);
        await updateDoc(taskDoc, {
          ...taskToSave,
          updatedAt: serverTimestamp(),
        });
      } else {
        // CREATE
        await addDoc(tasksRef, {
          ...taskToSave,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err: any) {
      console.error("Error saving task:", err);
      setModalError(err.message || "Failed to save task.");
    } finally {
      setModalLoading(false);
    }
  };

  // UPDATE: Toggle complete status
  const handleToggleComplete = async (id: string) => {
    if (!user || actionLoadingId) return;
    
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setActionLoadingId(id);
    setError(null);
    try {
      const taskDoc = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(taskDoc, {
        completed: !task.completed,
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      console.error("Error toggling completion:", err);
      setError(err.message || "Failed to update task status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!user || actionLoadingId) return;
    
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setActionLoadingId(id);
    setError(null);
    try {
      const taskDoc = doc(db, "users", user.uid, "tasks", id);
      await deleteDoc(taskDoc);
    } catch (err: any) {
      console.error("Error deleting task:", err);
      setError(err.message || "Failed to delete task.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingTask(task);
      setModalError(null);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 max-w-4xl w-full mx-auto relative">
      <header className="flex justify-between items-center bg-white p-4 rounded-3xl card-shadow cute-border mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 relative rounded-full overflow-hidden bg-pastel-pink flex items-center justify-center">
            <Image src="/mascot.jpg" alt="Profile" fill className="object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-text-dark">Hello, {user?.email?.split('@')[0] || 'User'}! 👋</h1>
            <p className="text-sm text-text-light">Let's get things done!</p>
          </div>
        </div>
        <Button variant="ghost" onClick={handleLogout}>Logout</Button>
      </header>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-dark">Your Tasks</h2>
        <Button className="flex items-center gap-2" onClick={openNewTaskModal}>
          <span className="text-xl leading-none">+</span> Add Task
        </Button>
      </div>

      {error && (
        <div className="w-full bg-red-100 text-red-600 p-4 rounded-xl mb-6 font-medium text-center border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-pulse text-lg font-bold text-pastel-pink">Loading tasks... 💖</div>
        </div>
      ) : tasks.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl card-shadow cute-border text-center opacity-80">
          <div className="w-32 h-32 relative mb-4 opacity-50">
            <Image src="/mascot.jpg" alt="Empty" fill className="object-contain grayscale" />
          </div>
          <h3 className="text-xl font-bold text-text-dark mb-2">No tasks yet!</h3>
          <p className="text-text-light">Click "Add Task" to create your first to-do.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={openEditTaskModal}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              isLoading={actionLoadingId === task.id}
            />
          ))}
        </div>
      )}

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
        isLoading={modalLoading}
        error={modalError}
      />
    </div>
  );
}