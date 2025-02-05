'use client'
import { Button } from "@repo/design-system/components/ui/button";
import { Mail, MessageSquare, RefreshCcw, Settings2, User } from "lucide-react";
import type { ReactElement } from "react";
import PromptArea from "./_components/prompt-area";

export default function Page() {
  return (
    <div className='grid h-dvh w-full content-center justify-items-center'>
      <div className=' w-7/12 space-y-8'>
        <header className=" flex flex-col gap-4">
            <h1 className='w-fit bg-gradient-to-r from-yellow-600 to-blue-500 bg-clip-text font-bold text-4xl text-transparent'>
              Hi there, <br/> What would you like to build?
            </h1>
            <p className='text-gray-400 text-lg'>
              Use one of most common prompts below or use your own to begin
            </p>
             <div className="space-y-2">
          <div className='mt-4 grid grid-cols-4 gap-2'>
                    <PromptExample content="Customer Satisfaction Survey for Product Feedback" Icon={<User size={18} />}/>
                    <PromptExample content="Monthly Employee Feedback and Performance Review" Icon={<Mail size={18} />}/>
                    <PromptExample content="Join Our Team: Job Application Form" Icon={<MessageSquare size={18} />}/>
                    <PromptExample content="Startup Incubator Funding Application Form" Icon={<Settings2 size={18} />}/>
                </div>
                <Button variant={'ghost'}> <RefreshCcw className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true"/> Refresh prompts</Button>
        </div>
        </header>
       
       <PromptArea/>

      </div>
        
    </div>
  );
}

function PromptExample({content, Icon}: {content: string, Icon: ReactElement}) {

    return (
        <div className='flex cursor-pointer flex-col justify-between gap-6 rounded-lg border p-4 text-gray-200 text-sm transition-colors hover:bg-neutral-900'>
            <p className="text-sm">{content}</p>
            {Icon}
        </div>
    )

}