'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import RegisterForm from "./_components/register";
import LoginForm from "./_components/login";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [openSheet, setOpenSheet] = React.useState(false);
  const searchParams = useSearchParams();
  const formType = searchParams.get("form");

  return (
    <div className="flex flex-col" >
      <div className="bg-primary flex justify-between items-center py-5 px-10">
        <h1 className="text-xl font-bold text-white"> Clean Room </h1>
        <Button variant={'outline'} onClick={ () => setOpenSheet(true)}> Login </Button>
      </div>
      <div className="grid lg:grid-cols-2 min-h-[80vh] items-center px-10"></div>

      <Sheet open={openSheet} onOpenChange={(open) => setOpenSheet(open)} >

        
        <SheetContent className="lg:max-w-[500px]">
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>
          <div className="flex justify-center items-center p-5 h-full">

            {formType == 'register' ? <RegisterForm /> : <LoginForm />}
          </div>

        </SheetContent>
      </Sheet>
    </div>
  );
}
