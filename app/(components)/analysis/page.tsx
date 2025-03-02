"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
const Analysis = () => {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        setAnalysis("No user ID found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/analyze?user_id=${user_id}`);
        const data = await response.json();

        if (data.error) {
          setAnalysis("Error fetching analysis. Try again later.");
        } else {
          setAnalysis(data.analysis);
        }
      } catch (error) {
        console.error("Error fetching AI analysis:", error);
        setAnalysis("Failed to load analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  return (
    <div className="">
      <nav className="flex flex-row">
        <h1 className="text-[32px] font-bold mb-4">AI Analysis</h1>
        <Link href='/' className="ml-auto">
        <button className="border-2 rounded-lg ml-auto border-black h-[50px] bg-black text-white w-[200px]">Go back to Homepage
        </button></Link>
        </nav>
      {loading ? (
        <p className="text-gray-500">Loading AI insights...</p>
      ) : (
        <p className="text-lg text-gray-800">{analysis}</p>
      )}
    </div>
  );
};

export default Analysis;
