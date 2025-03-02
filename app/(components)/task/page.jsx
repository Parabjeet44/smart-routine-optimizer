"use client";
import { useEffect, useState, useRef } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase.config";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const intervalRefs = useRef({}); // Store interval IDs for each task

  useEffect(() => {
    const fetchTasks = async () => {
      if (typeof window !== "undefined") {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return;

        const taskRef = collection(db, "user", user_id, "task");
        const res = await getDocs(taskRef);

        const taskData = res.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            expectedTime: data.expectedTime
              ? data.expectedTime.toDate().toLocaleString()
              : "No Date",
            isRunning: false, // Track if stopwatch is running
            elapsedTime: data.elapsedTime || 0, // Retrieve stored elapsed time from Firestore
            isEnded: false, // Track if the task has ended
          };
        });

        setTasks(taskData);
      }
    };

    fetchTasks();
  }, []);

  // Start stopwatch
  const startTimer = (taskId) => {
    intervalRefs.current[taskId] = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId && !task.isEnded
            ? { ...task, elapsedTime: task.elapsedTime + 1 }
            : task
        )
      );
    }, 1000);
  };

  // Stop stopwatch & save to Firestore
  const stopTimer = async (taskId, elapsedTime) => {
    if (intervalRefs.current[taskId]) {
      clearInterval(intervalRefs.current[taskId]); // Stop the interval
      delete intervalRefs.current[taskId]; // Remove from refs
    }

    // Update Firestore with elapsed time
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      const taskRef = doc(db, "user", user_id, "task", taskId);
      await updateDoc(taskRef, { elapsedTime }); // Save elapsed time

      console.log(`Elapsed time ${elapsedTime} saved for task: ${taskId}`);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  // Handle Start / End button click
  const handleButtonChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (!task.isRunning) {
            // Start Timer
            startTimer(taskId);
            return { ...task, isRunning: true, isEnded: false };
          } else {
            // Stop Timer and freeze time
            stopTimer(taskId, task.elapsedTime);
            return { ...task, isRunning: false, isEnded: true };
          }
        }
        return task;
      })
    );
  };

  // Format time into HH:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="space-y-10 w-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-row space-x-7 border-2 border-black h-[70px] w-auto pt-4 items-center"
          >
            <div>
              <p className="text-[20px] font-semibold">Title: {task.title}</p>
            </div>
            <div className="pl-[150px] flex flex-row">
              <p className="text-[20px] font-semibold">Description: {task.description}</p>
            </div>
            <div className="pl-[250px] flex flex-row">
              <p className="text-[20px] font-semibold">
                Expected Time: {task.expectedTime}
              </p>
            </div>
            <div className="pl-[150px] flex flex-row">
              <p className="text-[20px] font-semibold">
                Elapsed Time: {formatTime(task.elapsedTime)}
              </p>
            </div>
            <div className="flex space-x-6 pl-[100px]">
              {task.isRunning ? (
                <button
                  onClick={() => handleButtonChange(task.id)}
                  className="pb-3 border-2 w-[80px] h-[35px] border-orange-500 text-orange-500 flex items-center justify-center"
                >
                  <i className="fa-solid fa-stop pr-1"></i> End
                </button>
              ) : (
                <button
                  onClick={() => handleButtonChange(task.id)}
                  className="pb-3 border-2 w-[80px] h-[35px] border-green-500 text-green-500 flex items-center justify-center"
                >
                  <i className="fa-solid fa-play pr-1"></i> Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Task;
