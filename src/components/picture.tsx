import Image from "next/image";
import DeleteButton from "@/components/deleteButton";
import DownloadButton from "@/components/downloadButton";
import ShareButton from "@/components/shareButton";

export default function CardComponent({ _id, name }) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">
        {name}
      </div>
      <div className="relative h-96">
        <Image
          src={`/api/preview?_id=${_id}`}
          alt={name}
          objectFit="contain"
          layout="fill"
        />
      </div>

      <div className={"px-4 py-4 sm:px-6 flex items-center justify-center gap-x-2"}>
        <DownloadButton _id={_id} />
        <DeleteButton _id={_id} />
        <ShareButton _id={_id} />
      </div>

    </div>
  );
}
