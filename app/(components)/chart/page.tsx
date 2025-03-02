import React from "react";
import Link from "next/link";
import Barchart from "./barchart"
import TaskLineChart from './Linechart'

const Chart = () => {
  return (
    <div>
      <div className="flex">
        <h1 className="w-[136px] h-[48px] text-black text-[40px] font-semibold">
          Charts
        </h1>
        <Link href='/' className="ml-[1150px] mt-3"><button className=" border-2 border-black rounded-[24px] w-[120px] h-[45px] text-[14px] outline-none bg-black text-white">
          Homepage
        </button></Link>
        <Link href='/analysis' className="ml-auto mt-3"><button className=" border-2 border-black rounded-[24px] w-[120px] h-[45px] text-[14px] outline-none bg-black text-white">
          AI Analysis
        </button></Link>
      </div>
      <Barchart />
      <TaskLineChart />
    </div>
  );
};

export default Chart;
