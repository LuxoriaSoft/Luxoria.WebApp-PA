import NavBarComponent from "@/components/navBar";
import CardComponent from "@/components/picture";


async function fetchInventory() {
  const res = await fetch('http://localhost:3000/api/inventory');
  if (!res.ok) {
    throw new Error('Failed to fetch inventory data');
  }
  return res.json();
}

export default async function Home() {
  let inventory = [];
  try {
    inventory = await fetchInventory();
    console.log('Inventory:', inventory.files);
  } catch (error) {
    console.error('Error fetching inventory:', error);
  }

  return (
    <main className="container mx-auto">
      <div className="mt-2">
        <NavBarComponent />
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-4">Inventory</h1>
        {Array.isArray(inventory?.files) && inventory?.files.length > 0 ? (
          <ul>
            {inventory?.files.map((item : any) => (
              <li key={item._id}>
                <CardComponent _id={item._id} name={item.filename}/>
              </li>
            ))}
          </ul>
        ) : (
          <p>No inventory available.</p>
        )}
      </div>
    </main>
  );
}
