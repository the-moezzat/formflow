import { decodeFormData } from "@/utils/formEncoder"

// Page props type for searchParams
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined, form: string }>
}

async function Page({ searchParams }: PageProps) {
  // Extract query parameters
  const form = (await searchParams).form

  return (
    <div className="p-4">
      <h1>Form Editor</h1>
      <div className="mt-4">
        <pre>{JSON.stringify(decodeFormData(form), null, 2)}</pre>
      </div>
    </div>
  )
}

export default Page
