'use client'

export default function DeleteButton({_id}) {

  const handleClick = async () => {
    const res = await fetch(`/api/delete?_id=${_id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("File deleted !");
      window.location.reload();
    } else {
      alert("Error during deletion !");
    }
  }

  return (
    <button
      className={"rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}
      onClick={handleClick}
    >
      Delete
    </button>
  );
}