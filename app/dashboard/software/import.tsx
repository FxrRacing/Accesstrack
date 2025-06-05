'use client'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check, ChevronDown,  ChevronUp, Download, FileText, FileUp, Upload, X } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useState, useRef } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "sonner"




 

export default function ImportSoftware() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string[][]>([])
    const [error, setError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    // const [isOpen, setIsOpen] = useState(false)
   
    // const tableRef = useRef<HTMLDivElement>(null)
    // const [mounted, setMounted] = useState(false)


    const parseCSV = (file: File) => {
        const reader = new FileReader()
    
        reader.onload = (e) => {
          const text = e.target?.result as string
          const lines = text.split("\n").filter((line) => line.trim() !== "")
          const data = lines.map((line) => line.split(",").map((cell) => cell.trim()))
    
          // Only show first 8 rows for preview (header + 7 data rows)
          setPreview(data.slice(0, Math.min(9, data.length)))
        }
    
        reader.onerror = () => {
          setError("Error reading file")
        }
    
        reader.readAsText(file)
      }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    
        const droppedFile = e.dataTransfer.files[0]
    
        if (!droppedFile.name.endsWith(".csv")) {
          setError("Please upload a CSV file")
          return
        }
    
        setFile(droppedFile)
        parseCSV(droppedFile)
      }
    
      const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
      }
    
      const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
      }
    
      const downloadSample = async () => {
        const res = await fetch("/api/software/sample");
        if (!res.ok) {
          setError("Failed to fetch sample data");
          return;
        }
        const csv = await res.text();
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "software_sample_data.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
      const triggerFileInput = () => {
        fileInputRef.current?.click()
      }
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      parseCSV(file)
    }
    }

    const mockImportAction = async () => {
      if (!file || !preview.length) return
  
      try {
        setIsImporting(true)
  
        // Log the import action details
        console.group("CSV Import Action")
        console.log("File name:", file.name)
        console.log("File size:", (file.size / 1024).toFixed(2) + " KB")
        console.log("Total rows to import:", preview.length - 1)
  
        // Log the headers
        console.log("Headers:", preview[0])
  
        // Log a sample of the data (first 3 rows)
        console.log("Sample data:", preview.slice(1, 4))
  
        // Simulate API call with timeout
        console.log("Starting import process...")
  
        // Simulate a delay for processing
        await new Promise((resolve) => setTimeout(resolve, 1500))
  
        // Log success message
        console.log("Import completed successfully!")
        console.log(`${preview.length - 1} rows imported to database`)
        console.groupEnd()
  
        // Show success toast
        toast.success(`${preview.length - 1} rows were successfully imported.`)
  
        // Close the dialog
        // setIsOpen(false)
  
        // Reset state after closing
        setTimeout(() => {
          setFile(null)
          setPreview([])
          setError(null)
        }, 300)
      } catch (error) {
        console.error("Import failed:", error)
        setError("An error occurred during import")
      } finally {
        setIsImporting(false)
      }
    }
    return (
        <>
        <Dialog>
            <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/80 rounded-full px-6">
    <FileUp className="mr-2 h-4 w-4" />
    Upload File
  </Button>    
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] overflow-hidden rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">Import CSV Data</DialogTitle>
           
            <DialogDescription className="text-gray-500 text-base mt-2">
            Upload your CSV file to import data into your workspace
                </DialogDescription>
          </DialogHeader>
                
                {!file ? (
            <div>
              <div
                className={`
                  border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
                  ${isDragging ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"}
                `}
                onClick={triggerFileInput}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
                <div
                  className={`
                  p-4 rounded-full mb-5 transition-all duration-200
                  ${isDragging ? "bg-purple-100 scale-110" : "bg-purple-50"}
                `}
                >
                  <Upload className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="text-gray-800 font-semibold text-lg mb-2">
                  {isDragging ? "Drop your file here" : "Upload your CSV file"}
                </h3>
                <p className="text-gray-600 text-center mb-2">
                  Drag and drop your file here, or <span className="text-purple-500 font-semibold">browse</span>
                </p>
                <p className="text-xs text-gray-500 text-center">Your data will be securely processed</p>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4 rounded-xl border border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center mt-5 px-1">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-1.5 rounded-full">
                    <FileText className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">CSV files only</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">Maximum size: 10MB</span>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors rounded-xl px-4 py-2 font-medium"
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadSample()
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download sample template
                </Button>
              </div>
            </div>
          ) : (


<>
<div className="w-full"> 

<Tabs defaultValue="preview" className="w-full">
  <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 bg-gray-100/80 backdrop-blur-sm">
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="file">File</TabsTrigger>
  </TabsList>
  <TabsContent value="preview">
  <div>
    
   
    {preview.length > 0 && (
    <>
    <Collapsible open={isPreviewOpen} onOpenChange={setIsPreviewOpen} className="w-full">
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Preview data to be imported</h3>
                      {preview.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          A total of {preview.length - 1} rows will be added to your data
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Here is a preview of the data that will be added (showing the first 8 rows).
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {isPreviewOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    {preview.length > 0 ? (
                      <div className="border rounded-md overflow-hidden shadow-sm">
                        <ScrollArea className="w-fit" style={{ maxHeight: "320px", maxWidth: "750px" }}>
                          <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                              <tr>
                                {preview[0].map((header, i) => (
                                  <th
                                    key={i}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {preview.slice(1).map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                  {row.map((cell, j) => (
                                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <ScrollBar orientation="horizontal" />
                          <ScrollBar orientation="vertical" />
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-8 border rounded-md">
                        <p className="text-gray-500 text-sm">No preview available</p>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>  
   
    </>
) 
}
    
    
    </div>
  </TabsContent>
  <TabsContent value="file">
  <div className="flex items-center gap-5 p-6 border rounded-xl bg-white shadow-sm">
    <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-xl">
      <FileText className="h-7 w-7 text-purple-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-900 truncate text-lg">{file.name}</p>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
        <span className="text-sm text-gray-500">CSV</span>
        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
    <Button
      variant="outline"
      size="sm"
      className="rounded-full h-9 w-9 p-0 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
      onClick={() => {
        setFile(null)
        setPreview([])
      }}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Remove file</span>
    </Button>
  </div>

  <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
    <div className="flex items-center gap-2 mb-2">
      <Check className="h-4 w-4 text-green-500" />
      <p className="text-sm font-medium text-gray-700">File validation passed</p>
    </div>
    <p className="text-xs text-gray-500 ml-6">Your CSV file is valid and ready to be imported</p>
  </div>

  </TabsContent>

</Tabs>
</div>




            
           
            </>
          )}
          


                <DialogFooter className="flex flex-row justify-between gap-2 w-full">
                <Button variant="outline" className="flex-1 py-3 font-medium rounded-xl" onClick={() => {
                    setFile(null)
                    setPreview([])
                    setError(null)
                }}>
              Cancel
            </Button>
                    <Button
              className={`
                flex-1 py-3 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                ${file ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white" : "bg-gray-100 text-gray-400"}
              `}
              disabled={!file || isImporting}
              onClick={mockImportAction}
            >
              {isImporting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Importing...
                </>
              ) : file ? (
                "Import data"
              ) : (
                "Upload a file"
              )}
            </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
       
    )
}


{/* <Tabs defaultValue="preview" className="w-full">
<TabsList className="grid w-full grid-cols-2 rounded-xl p-1 bg-gray-100/80 backdrop-blur-sm">
  <TabsTrigger
    value="preview"
    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2.5 font-medium"
  >
    Preview
  </TabsTrigger>
  <TabsTrigger
    value="file"
    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm py-2.5 font-medium"
  >
    File Info
  </TabsTrigger>
</TabsList>

<TabsContent value="preview" className="mt-6">
  <div>
    <h3 className="text-xl font-semibold text-gray-900">Preview data to be imported</h3>
    {preview.length > 0 && (
      <p className="text-base text-gray-600 mt-1">
        A total of {preview.length - 1} rows will be added to your data
      </p>
    )}
    <p className="text-sm text-gray-500 mt-1 mb-4">
      Here is a preview of the data that will be added (showing the first 8 rows).
    </p>

    {preview.length > 0 ? (
      <div className="relative">
        <div ref={tableRef} className="overflow-x-auto border rounded-lg" style={{ maxHeight: "320px" }}>
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {preview[0].map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50 border-b"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {preview.slice(1).map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-md"
            onClick={() => scrollTable("left")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-md"
            onClick={() => scrollTable("right")}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center p-8 border rounded-md">
        <p className="text-gray-500 text-sm">No preview available</p>
      </div>
    )}
  </div>
</TabsContent>

<TabsContent value="file" className="mt-6">
  <div className="flex items-center gap-5 p-6 border rounded-xl bg-white shadow-sm">
    <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-xl">
      <FileText className="h-7 w-7 text-purple-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-900 truncate text-lg">{file.name}</p>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
        <span className="text-sm text-gray-500">CSV</span>
        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
    <Button
      variant="outline"
      size="sm"
      className="rounded-full h-9 w-9 p-0 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
      onClick={() => {
        setFile(null)
        setPreview([])
      }}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Remove file</span>
    </Button>
  </div>

  <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
    <div className="flex items-center gap-2 mb-2">
      <Check className="h-4 w-4 text-green-500" />
      <p className="text-sm font-medium text-gray-700">File validation passed</p>
    </div>
    <p className="text-xs text-gray-500 ml-6">Your CSV file is valid and ready to be imported</p>
  </div>
</TabsContent>
</Tabs> */}