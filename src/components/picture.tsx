import Image from "next/image";

export default function CardComponent({_id, name}) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">
        {name}
      </div>
      <div className="px-4 py-5 sm:p-6 relative h-64 w-full">
        <Image
          src={`/api/preview?_id=${_id}`}
          alt={name}
          width={500}
          height={300}
          layout="responsive"
          objectFit="cover"
        />
      </div>
      <div className="px-4 py-4 sm:px-6">
        {/* Content goes here */}
        {/* We use less vertical padding on card footers at all sizes than on headers or body sections */}
      </div>
    </div>
  )
}