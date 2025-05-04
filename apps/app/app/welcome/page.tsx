import CreateWorkspaceForm from '@repo/auth/components/create-workspace-form';

function Page() {
  return (
    <div className="w-[450px] space-y-8 ">
      <div className="space-y-2">
        <h1 className="font-semibold text-xl">Welcome to Formflow</h1>
        <p className="text-muted-foreground text-sm">
          Create a workspace to get started
        </p>
      </div>

      <CreateWorkspaceForm />
    </div>
  );
}

export default Page;
