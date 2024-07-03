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

async function fetchContentByID(id: string) {
  const res = await fetch(`/api/inventory/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch inventory data`);
  }
  return res.json();
}

interface InventoryItem {
  _id: string;
  filename: string;
}

interface InventoryData {
  files: InventoryItem[];
}

interface GridComponentProps {
  galleryId: string | null;
}

export default function GridComponent({ galleryId }: GridComponentProps) {
  const [inventory, setInventory] = useState<InventoryData | null>(null);

  useEffect(() => {
    if (galleryId) {
      fetchContentByID(galleryId)
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
  }, [galleryId]);

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
            <CardComponent key={item._id} _id={item._id} name={item.filename} afterDelete={() => RemoveCardFromList(item._id)} />
          ))}
        </div>
      ) : (
        <p>No inventory available.</p>
      )}
    </>
  );
}
