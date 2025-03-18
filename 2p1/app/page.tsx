import SourceCodeConverter from '@/components/SourceCodeConverter'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Source Code to Website Converter</h1>
      <SourceCodeConverter />
    </main>
  )
}

