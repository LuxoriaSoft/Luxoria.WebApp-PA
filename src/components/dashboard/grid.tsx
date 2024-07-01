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

interface InventoryItem {
  _id: string;
  filename: string;
}

interface InventoryData {
  files: InventoryItem[];
}

export default function GridComponent() {
  const [inventory, setInventory] = useState<InventoryData | null>(null);

  useEffect(() => {
    fetchInventory()
      .then((data: InventoryData) => {
        setInventory(data);
      })
      .catch((error) => {
        console.error('Error fetching inventory:', error);
      });
  }, []);

  return (
    <>
      {inventory && Array.isArray(inventory.files) && inventory.files.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.files.map((item) => (
            <CardComponent key={item._id} _id={item._id} name={item.filename} />
          ))}
        </div>
      ) : (
        <p>No inventory available.</p>
      )}
    </>
  );
}
