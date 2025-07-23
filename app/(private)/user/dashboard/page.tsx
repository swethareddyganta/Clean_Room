import { getLoggedInUser } from '@/actions/users'
import LogoutButton from '@/components/functional/logout-button';
import { IUser } from '@/interfaces';
import React from 'react'

async function page() {
  const response = await getLoggedInUser();
  if (!response.success) {
    return (
      <h1> {response.message || "You are not logged In. Please log in to access dashboard."}</h1>
    );
  }
  const user: IUser = response.data!;
  return (
    <div className='flex flex-col gap-5'>
      <h1> User Dashboard! </h1>
       <h1> User Id: { user.id }</h1>
      <h1> Name: {user.name}</h1>
      <h1> Email: {user.email}</h1>
      <h1> Role: {user.role}</h1>
      <LogoutButton/>
    </div>
  )
}

export default page
