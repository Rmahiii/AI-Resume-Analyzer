import { CloudUpload, LockKeyhole } from "lucide-react";
import { useDropzone } from "react-dropzone";

export function ResumeDropzone({ file, onFile, cta = "Upload your resume" }) {
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
      className={`group grid min-h-[230px] cursor-pointer place-items-center rounded-[28px] border border-dashed p-4 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)] transition duration-300 ${
        isDragActive
          ? "border-[#7dd3fc] bg-white/25"
          : "border-[#7078ff]/80 bg-white/[0.13] hover:-translate-y-0.5 hover:border-[#9ddcff] hover:bg-white/[0.18]"
      }`}
    >
      <input {...getInputProps()} />
      <div className="grid w-full justify-items-center gap-4 rounded-[22px] border border-dashed border-[#7985ff]/70 bg-white/95 px-4 py-6 text-[#17244a] shadow-[0_20px_55px_rgba(7,20,55,0.22)]">
        <CloudUpload className="text-[#535dea] transition group-hover:scale-110" size={38} strokeWidth={1.8} />
        <div>
          <strong className="block break-all text-lg font-semibold">{file ? file.name : "Drop your resume here"}</strong>
          <span className="mt-1 block text-base text-[#36427b]">PDF & DOCX supported</span>
        </div>
        <span className="button rounded-xl bg-gradient-to-r from-[#5c63f1] to-[#6d78ff] px-8 text-base text-white shadow-lg shadow-indigo-500/25 group-hover:scale-[1.02]">
          {cta}
        </span>
        <span className="flex items-center gap-2 text-sm font-medium text-[#465078]">
          <LockKeyhole size={15} /> Secure & private
        </span>
      </div>
    </div>
  );
}
