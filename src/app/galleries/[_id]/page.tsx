import NavBarComponent from "@/components/navBar";
import GridComponent from "@/components/dashboard/grid";

export default async function GalleryInfo(context : any) {
  const { params } = context;
  const galleryId = params._id;

  return (
    <main className="container mx-auto">
      <div className="mt-2">
        <NavBarComponent/>
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-4">Gallery</h1>

        <p>Specific gallery using its gallery ID</p>
        <p>ID : {galleryId}</p>

        <GridComponent galleryId={galleryId}/>
      </div>
    </main>
  );
}