import NavBarComponent from "@/components/navBar";
import TableComponent from "@/components/galleries/table";

export default async function GalleriesPage() {

  return (
    <main className="container mx-auto">
      <div className="mt-2">
        <NavBarComponent/>
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-4">Galleries</h1>

        <TableComponent />
      </div>
    </main>
  );
}