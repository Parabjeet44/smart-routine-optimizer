import './globals.css';
import Navbar from './(components)/nav/page';
import Tasks from './(components)/tasks/page';
import Task from './(components)/task/page'
const Page = () => {
  return (
    <div>
      <Navbar /> 
      <Tasks />  {/* add task component here */}
      <Task />
    </div>
  )
}

export default Page
