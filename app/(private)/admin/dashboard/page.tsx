'use client'
import React, { useEffect } from 'react'
import { getLoggedInUser } from '@/actions/users'
import { IUser } from '@/interfaces';
import toast from 'react-hot-toast';
import LogoutButton from '@/components/functional/logout-button';


function page() {
  const [user, setUser] = React.useState<IUser | null>( null);



  const fetchData = async () => {

    try {
      const response: any = await getLoggedInUser();
      if (!response.success) {
        throw new Error(response.message);
      }
      setUser(response.data);
      
    } catch (error: any) {
      throw new Error(error.message);
      
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className='flex flex-col gap-5'>
       <h1> Admin Dashboard! </h1>
      {user && (
        <>
          <h1> User Id: { user.id }</h1>
      <h1> Name: {user.name}</h1>
      <h1> Email: {user.email}</h1>
          <h1> Role: {user.role}</h1>
          <LogoutButton/>
        </>
      )}
     
       
    </div>
  )
}

export default page
