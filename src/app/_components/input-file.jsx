import { Input } from "@/components/ui/input";
import { FileArchiveIcon, FileImageIcon, FileTextIcon } from "lucide-react";

export function FileForm() {
  return (
    <form className="mt-16 flex flex-col items-center justify-center">
      <p className="mb-2 flex items-center justify-center text-3xl font-semibold">
        Make it Temporary, Make it Easy
      </p>
      <label className="flex w-lg flex-col items-center justify-center rounded-2xl border-2 border-dotted border-gray-200 bg-gray-50 pb-6 capitalize">
        <div className="mt-5 flex flex-col items-center justify-center text-gray-500">
          <div className="relative flex h-17 w-29 items-center justify-center">
            <FileArchiveIcon className="absolute top-3.5 left-4 size-10 rotate-[-15deg] stroke-1" />
            <FileImageIcon className="absolute top-3 left-1/2 z-1 size-14 -translate-x-1/2 fill-gray-50 stroke-1" />
            <FileTextIcon className="absolute top-4 right-4 size-10 rotate-[15deg] stroke-1" />
          </div>
          <p>
            drop your files here or <span className="capitalize">browse</span>
          </p>
          <p>max file size: 50mb</p>
        </div>
        <Input type="file" id="dropzone-file" className="hidden" />
      </label>
    </form>
  );
}
