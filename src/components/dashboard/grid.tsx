"use client";

import CardComponent from "@/components/picture";
import { useEffect, useState } from "react";

async function fetchInventory() {
  const res = await fetch('/api/inventory');
  if (!res.ok) {
    throw new Error('Failed to fetch inventory data');
  }
  return res.json();
}

async function fetchInventoryByID(id: string) {
  const res = await fetch(`/api/inventory/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch inventory data`);
  }
  return res.json();
}

async function fetchGalleries() {
  const res = await fetch('/api/galleries');
  if (!res.ok) {
    throw new Error('Failed to fetch galleries data');
  }
  return res.json();
}

interface InventoryItem {
  _id: string;
  filename: string;
  relatedToGalleryID: string | null;
}

interface InventoryData {
  files: InventoryItem[];
}

interface GalleryData {
  _id: string;
  name: string;
  description: string;
  email: string;
}

interface GridComponentProps {
  galleryId: string | null;
}

export default function GridComponent({ galleryId }: GridComponentProps) {
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [galleries, setGalleries] = useState<GalleryData[]>([]);

  useEffect(() => {
    if (galleryId) {
      fetchInventoryByID(galleryId)
          .then((data: InventoryData) => {
            setInventory(data);
          })
          .catch((error) => {
            console.error('Error fetching inventory:', error);
          });
    } else {
      fetchInventory()
        .then((data: InventoryData) => {
          setInventory(data);
        })
        .catch((error) => {
          console.error('Error fetching inventory:', error);
        });
    }

    fetchGalleries()
      .then((data) => {
        setGalleries(data.galleries);
      })
      .catch((error) => {
        console.error('Error fetching galleries:', error);
      });
  }, [galleryId, setInventory, setGalleries]);

  const RemoveCardFromList = async (id: string) => {
    const updatedFiles = inventory?.files.filter((item) => item._id !== id);
    if (!updatedFiles) {
      return;
    }
    setInventory({ files: updatedFiles });
  }

  return (
    <>
      {inventory && Array.isArray(inventory.files) && inventory.files.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.files.map((item) => (
            <CardComponent
              key={item._id}
              _id={item._id}
              name={item.filename}
              galleryName={
                galleries.find((gallery) => gallery._id === item.relatedToGalleryID)?.name || null
              }
              afterDelete={() => RemoveCardFromList(item._id)} />
          ))}
        </div>
      ) : (
        <p>No inventory available.</p>
      )}
    </>
  );
}
