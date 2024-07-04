import NavBarComponent from "@/components/navBar";
import CardComponent from "@/components/picture";
import GridComponent from "@/components/dashboard/grid";
import Layout from "@/components/footer";

export default async function Home() {

  return (
    <main className="container mx-auto">
      <div className="mt-2">
        <NavBarComponent />
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-4">Inventory</h1>
        <GridComponent galleryId={null} />
          <Layout />
      </div>
    </main>
  );
}
