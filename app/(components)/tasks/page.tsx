"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { useState } from 'react'
import { db } from '@/app/lib/firebase.config'
import { query,addDoc,doc,collection } from 'firebase/firestore'
import Swal from 'sweetalert2'


const Tasks = () => {
    const [isOpen,setOpen]=useState(false);
    const[taskInput,setTaskInput] = useState('');
    const [expectedTaskTime,setExpectedTaskTime]=useState<Date|null>(null);
    const [taskDescription,setTaskDescription]=useState<string|null>('');
    const router = useRouter();

    //Handle input of task
    const handleTaskInput=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setTaskInput(event.target.value);
    }

    //handle getting input of expected time
    const handleExpectedTaskTime=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const newDate=event.target.value;
        const date=new Date(newDate);
        setExpectedTaskTime(date);
    }

    //Handle input of description
    const handleTaskDescription=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setTaskDescription(event.target.value);
    }

    //Handle the form submission
    const handleSubmission=async (event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const userId = localStorage.getItem("user_id");
        if(!userId){
            Swal.fire({
                title: "Please Login First",
                text: "You need to login to access this page",
                icon: "warning",
            })
            return
        }
        const adddoc=await addDoc(collection(db,"user",userId,"task"),{
            title:taskInput,
            description:taskDescription,
            expectedTime:expectedTaskTime
        })
        Swal.fire({
            title: "Task Added",
            text: "Your task has been added successfully",
            icon: "success",
        })
    }


    //Handle Route the select
    const handleRoute=(event:React.ChangeEvent<HTMLSelectElement>)=>{
        const selectedEvent=event.target.value;
        if(selectedEvent){
            router.push(selectedEvent);
        }
    }
    //Handle the modal popup
    const handlePopup=()=>{
        setOpen(!isOpen);
    }
    return (
        <div>
            <div className='flex flex-row backdrop-blur-2xl bg-opacity-95'>
                <h1 className='text-[40px] relative -top-3 font-bold'>Tasks</h1>
                <button  className='text-3xl ml-[1275px] relative -top-3' onClick={handlePopup}><i className='fa-solid fa-circle-plus '></i></button>
                <select className='ml-auto w-[85px] h-[30px] font-bold mr-10 mt-1' onChange={handleRoute}> 
                    <option>Options</option>
                    <option value='/chart'>View Chart</option>
                    <option value='/analysis'>AI Analysis</option>
                </select>
            </div>
            {/* Logic for the Popup */}
            {isOpen && (
                <div className='fixed bg-white w-[855px] h-[500px] rounded-[16px] ml-[360px] transition duration-500 ease-in-out text-center'>
                    <div className='flex justify-center'>
                        <form onSubmit={handleSubmission} className='flex flex-col mt-[80px] space-y-3'>
                            <p className='w-[193px] h-[39px] text-[32px] font-bold text-center ml-[60px]'>Add the task</p>
                            <input type='text' onChange={handleTaskInput} className='border-2 outline-none rounded-2xl border-black pl-2 w-[324px] h-[33px]' placeholder='Enter the task ...' required/>
                            <p className='w-[380px] h-[39px] text-[28px] font-bold text-center ml-[-25px]'>Description of the task</p>
                            <input type='text' onChange={handleTaskDescription} className='border-2 outline-none rounded-2xl border-black pl-2 w-[324px] h-[33px]' placeholder='Enter the task description ...' required/>
                            <input onChange={handleExpectedTaskTime} className='border-2 outline-none rounded-2xl border-black pl-2 w-[324px] h-[33px]' type='datetime-local' required/>
                            <input className='border-2 outline-none rounded-2xl bg-black text-white pl-2 w-[324px] h-[35px]' type='submit' value='Add task'/>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Tasks
