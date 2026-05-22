import { FileUp } from "lucide-react";
import { useDropzone } from "react-dropzone";

export function ResumeDropzone({ file, onFile }) {
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropAccepted: ([accepted]) => onFile(accepted)
  });

  return (
    <div
      {...getRootProps()}
      className={`grid min-h-[180px] cursor-pointer place-items-center rounded-lg border border-dashed p-5 text-center transition ${
        isDragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-300 bg-white/55 hover:border-blue-500 dark:border-slate-600 dark:bg-black/10"
      }`}
    >
      <input {...getInputProps()} />
      <div className="grid justify-items-center gap-2">
        <FileUp className="text-blue-700 dark:text-blue-300" size={30} />
        <strong>{file ? file.name : "Drop resume PDF or DOCX"}</strong>
        <span className="text-sm text-zinc-500 dark:text-zinc-300">5 MB max</span>
      </div>
    </div>
  );
}
