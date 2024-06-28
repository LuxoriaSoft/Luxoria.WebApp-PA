import Image from "next/image";

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
          objectFit={"contain"}
          layout={"fill"}
        />
      </div>
      <div className="px-4 py-4 sm:px-6">
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Download
        </button>
      </div>
    </div>
  );
}
